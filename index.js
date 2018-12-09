const {
  app, BrowserWindow, globalShortcut,
  ipcMain, protocol
} = require('electron');
const { spawn } = require('child_process');
const net = require('net');
const path = require('path');

const ffmpegProgressServer = net.createServer(socket => {
  socket.on('data', data => {
    console.log(data.toString('utf-8'))
  })
})
ffmpegProgressServer.listen(0, '127.0.0.1', () => {
  const port = ffmpegProgressServer.address().port;
  const subprocess = spawn('ffmpeg.exe', [
    '-f', 'concat', '-safe', '0',
    '-i', 'list.txt',
    '-progress', `tcp://127.0.0.1:${port}`,
    '-an', '-vf', 'setpts=PTS/360', 'out.mp4'
  ])
})

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 768,
    height: 432
  })

  mainWindow.openDevTools();

  mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'))

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
