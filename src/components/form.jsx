import React, { Component } from 'react';

class Form extends Component{
	constructor(props){
		super(props);
		this.state = {
			videos: new Set(),
			speedMultiplier: 360
		}
		this.dialog = window.require('electron').remote.dialog;
	}

	componentDidMount(){
		//this.props.ipc.send('export', {videos: ['1.mp4', '2.mp4', '3.mp4'], speedMultiplier: 2, outputDir: 'out.mp4'});
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
			/* TODO send ipc export data
			let data = {
				videos: [...],
				speedMultiplier: this.state.speedMultiplier,
				outputDir: exportPath
			}
			*/
			// this.props.ipc.send('export', data);
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

	render(){
		return (
			<form onSubmit={this.exportVideo.bind(this)}>
				<div className='video-container' onDragOver={this.dragOver} onDrop={this.dropVideo.bind(this)}>
					<div className='video-preview'><video src='../1.mp4'></video></div>
					<ul className='video-list'>
						{[...this.state.videos].map(v => (
							<li key={v} tabIndex={0}>{v}</li>
						))}
					</ul>
				</div>
				<input type='number' min={1} onChange={this.speedMultiplierChange.bind(this)} value={this.state.speedMultiplier}></input>
				<button>export</button>
			</form>
		)
	}
}

export default Form;