import React, { Component } from 'react';

class Form extends Component{
	constructor(props){
		super(props);
		this.state = {
			videos: new Set(),
			speedMultiplier: 360,
			preview: '',
			mute: true,
			canExport: true
		}
		this.dialog = window.require('electron').remote.dialog;
	}

	componentDidMount(){
		this.props.ipc.on('progress', (e, d) => {
			if (d.progress === 'end'){
				this.setState({canExport: true});
			} else {
				this.setState({canExport: false});
			}
		})
	}

	speedMultiplierChange(e){
		this.setState({speedMultiplier: e.target.value})
	}

	exportVideo(e){
		e.preventDefault();
		let exportPath = this.dialog.showSaveDialog({
			filters: [
				{
					name: 'Video',
					extensions: ['mp4']
				}
			]});
		if (exportPath){
			let data = {
				videos: [...this.state.videos],
				speedMultiplier: this.state.speedMultiplier,
				mute: this.state.mute,
				outputDir: exportPath
			}
			this.props.ipc.send('export', data);
		}
	}

	dropVideo(e){
		e.preventDefault();
		let files = e.dataTransfer.files;
		for (let i = 0; i < files.length; i++){
			if (files[i].type.startsWith('video')){
				this.setState(prev => ({
					videos: new Set(prev.videos.add(files[i].path))
				}))
			}
		}
	}

	dragOver(e){
		e.preventDefault();
	}

	changePreview(v){
		return e => {
			this.setState({preview: v});
		}
	}

	removeVid(vid){
		return e => {
			this.setState(prev => {
				let videos = prev.videos;
				videos.delete(vid);
				
				let state = {videos: videos};
				if (prev.preview === vid){
					state.preview = '';
				}
				return state;
			})
		}
	}

	videoDragStart(video_path){
		return e => {
			e.dataTransfer.setData('video', video_path);
		}
	}

	openVideo(e){
		if (e.target.draggable) return;
		let res = this.dialog.showOpenDialog({
			title: 'Select Video File(s)',
			properties: ['openFile', 'multiSelections'],
			filters: [{
				name: 'Video',
				extensions: ['mp4', 'mkv', 'webm', 'avi']
			}]
		})

		if (res){
			this.setState(prev => {
				res.forEach(v => {
					prev.videos.add(v);
				})
				return {videos: prev.videos}
			})
		}
	}

	videoDrop(e){
		let video = e.target.title;
		let videoDropped = e.dataTransfer.getData('video');
		let droppedDown = e.nativeEvent.offsetY > e.target.offsetHeight / 2;

		// only 2 accepted cases
		// 1 - dropping a video list item
		// 2 - dropping a video file
		if (videoDropped){
			this.setState(prev => {
				let videos = prev.videos;
				videos.delete(videoDropped);
				videos = [...videos];
				videos.splice(videos.indexOf(video)+droppedDown, 0, videoDropped);
				return {
					videos: new Set(videos)
				}
			})
		} else if (e.dataTransfer.files.length){
			let video_files = [];
			for (let i = 0; i < e.dataTransfer.files.length; i++){
				if (e.dataTransfer.files[i].type.startsWith('video')){
					video_files.push(e.dataTransfer.files[i].path);
				}
			}
			if (video_files.length){
				this.setState(prev => {
					let videos = [...prev.videos];
					videos.splice(videos.indexOf(video)+droppedDown, 0, ...video_files);
					return {
						videos: new Set(videos)
					}
				})
			}
		}
	}

	toggleMute(e){
		this.setState(prev => ({
			mute: !prev.mute
		}))
	}

	render(){
		return (
			<form onSubmit={this.exportVideo.bind(this)}>
				<div className='video-container' onDragOver={this.dragOver} onDrop={this.dropVideo.bind(this)}>
					<div className='video-preview'><video src={this.state.preview} controls></video></div>
					<ul className={this.state.videos.size ? 'video-list' : 'video-list empty'} onClick={this.openVideo.bind(this)}>
						{[...this.state.videos].map(v => (
							<li title={v} key={v} tabIndex={0} onDoubleClick={this.changePreview(v)}
							draggable onDragOver={e => e.preventDefault()} onDragStart={this.videoDragStart(v)} onDrop={this.videoDrop.bind(this)}
							>
								{v.replace(/\\/g,'/').split('/').pop()}
								<a href='#' className='close' onClick={this.removeVid(v).bind(this)}></a>
							</li>
						))}
					</ul>
				</div>
				<div className='submission-container'>
					<label>
						Speed Multiplier:
						<input type='number' min='0.5' step='0.1' onChange={this.speedMultiplierChange.bind(this)} value={this.state.speedMultiplier}></input>
					</label>
					<label>
						Mute output:
						<input type='checkbox' checked={this.state.mute} onChange={this.toggleMute.bind(this)}></input>
					</label>
					<button disabled={!this.state.canExport || !this.state.videos.size}>export</button>
				</div>
			</form>
		)
	}
}

export default Form;