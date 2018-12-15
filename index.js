const {
	app, BrowserWindow, globalShortcut,
	ipcMain, protocol
} = require('electron');
const fs = require('fs');
const { spawn } = require('child_process');
const net = require('net');
const path = require('path');
const { parseFFMPEGProgress }  = require('./src/utils');

let appChannel;
let port;
let mainWindow;
let videoDurations = [];


/*
 * Splices together videos sped up by speedMultiplier and saves it to out
 * @param {string[]} videos - list of video paths
 * @param {float} speedMultiplier - the amount to speed up the video(s)
 * @param {string} out - output path
 * @returns {void}
 */
function spliceUp(videos, speedMultiplier, out, mute=true){
	// store video durations (seconds) 
	videos.forEach(f => {
		let probe = spawn('ffprobe', [
			'-v', 'error',
			'-show_entries', 'format=duration',
			'-of', 'default=noprint_wrappers=1:nokey=1', f
		]);
		probe.stdout.on('data', data => {
			videoDurations.push((Number(data.toString('utf-8')) | 0) / speedMultiplier);
		});
	});

	fs.writeFileSync('list.txt', videos.map(v => `file '${v}'`).join('\n'));
	let args = [
		'-y',
		'-f', 'concat', '-safe', '0',
		'-i', 'list.txt',
		'-progress', `tcp://127.0.0.1:${port}`,
		'-vf', `setpts=PTS/${speedMultiplier}`, out
	];
	if (mute || speedMultiplier < 0.5){
		args.splice(args.indexOf('-vf'), 0, '-an');
	} else {
		let exp = (Math.floor(speedMultiplier)).toString(2).length-1;
		let remainder = speedMultiplier/(2 ** exp);

		let speedUp = Array(exp).fill('atempo=2');
		speedUp.push(`atempo=${remainder}`);
		speedUp = speedUp.join(',');

		args.splice(args.indexOf(out), 0, ...['-filter:a', speedUp]);
	}
	const subprocess = spawn('ffmpeg', args);
	subprocess.on('close', code => {
		fs.unlink('list.txt', e => {if (e) throw err;});
		videoDurations.length = 0;
	});
}


function createWindow () {
	mainWindow = new BrowserWindow({
		width: 768,
		height: 432,
		icon: __dirname + './src/static/icon/icon.ico'
	});

	// mainWindow.openDevTools();

	mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));

	mainWindow.on('closed', function () {
		mainWindow = null;
	});
}


const ffmpegProgressServer = net.createServer(socket => {
	socket.on('error', e => {});
	socket.on('data', data => {
		data = parseFFMPEGProgress(data.toString('utf-8'));
		if (videoDurations){
			data.out_time_final = videoDurations.reduce((a, b) => a+b);
		} else {
			data.out_time_final = 0;
		}

		if (appChannel){
			appChannel.sender.send('progress', data);
		}
	});
});
ffmpegProgressServer.listen(0, '127.0.0.1', () => {
	port = ffmpegProgressServer.address().port;
});

app.on('ready', createWindow);

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow();
	}
});

ipcMain.on('export', (e, payload) => {
	appChannel = e;
	spliceUp(payload.videos, payload.speedMultiplier, payload.outputDir, mute=payload.mute);
});