/*
 * Parses FFMPEG progress string and returns an object
 * @param {string} progress - example string:
 * frame=17
 * fps=2.12
 * stream_0_0_q=-1.0
 * bitrate=1073.5kbits/s
 * total_size=62630
 * out_time_us=466732
 * out_time_ms=466732
 * out_time=00:00:00.466732
 * dup_frames=0
 * drop_frames=5130
 * speed=0.0582x
 * progress=end
 * @returns {object}
 */
function parseFFMPEGProgress(progress){
	const reBitrate = /bitrate=(.*)/;
	const reTotalSize = /total_size=(.*)/;
	const reOutTime = /out_time=(.*)/;
	const reProgress = /progress=(.*)/;
	let result = {};
	if (reBitrate.test(progress)){
		result.bitrate = reBitrate.exec(progress)[1];
	}
	if (reTotalSize.test(progress)){
		result.total_size = Number(reTotalSize.exec(progress)[1]);
	}
	if (reOutTime.test(progress)){
		result.out_time = reOutTime.exec(progress)[1];
	}
	if (reProgress.test(progress)){
		result.progress = reProgress.exec(progress)[1];
	}
	return result;
}

module.exports = {
	parseFFMPEGProgress
};