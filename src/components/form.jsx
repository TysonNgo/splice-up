import React, { Component } from 'react';

class Form extends Component{
	constructor(props){
		super(props);
		this.state = {
			videos: new Set(),
			speedMultiplier: 360,
			preview: '',
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
				return {videos: videos}
			})
		}
	}

	videoDragStart(video_path){
		return e => {
			e.dataTransfer.setData('video', video_path);
		}
	}

	videoDrop(e){
		console.log(e.dataTransfer.getData('video'), e.nativeEvent.offsetY, e.target.offsetHeight, e.dataTransfer.items, e.dataTransfer.files)
	}

	render(){
		return (
			<form onSubmit={this.exportVideo.bind(this)}>
				<div className='video-container' onDragOver={this.dragOver} onDrop={this.dropVideo.bind(this)}>
					<div className='video-preview'><video src={this.state.preview} controls></video></div>
					<ul className={this.state.videos.size ? 'video-list' : 'video-list empty'}>
						{[...this.state.videos].map(v => (
							<li title={v} key={v} tabIndex={0} onDoubleClick={this.changePreview(v)}
							draggable onDrag={this.test} onDragOver={e => e.preventDefault()} onDragStart={this.videoDragStart(v)} onDrop={this.videoDrop}
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
						<input type='number' min={1} onChange={this.speedMultiplierChange.bind(this)} value={this.state.speedMultiplier}></input>
					</label>
					<button disabled={!this.state.canExport || !this.state.videos.size}>export</button>
				</div>
			</form>
		)
	}
}

export default Form;