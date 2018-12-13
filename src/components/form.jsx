import React, { Component } from 'react';

class Form extends Component{
	constructor(props){
		super(props);
		this.state = {
			videos: [],
			speedMultiplier: 360
		}
		this.dialog = window.require('electron').remote.dialog;
		console.log(this.props)
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

	render(){
		return (
			<form onSubmit={this.exportVideo.bind(this)}>
			// TODO drag videos to video list
				<video></video>
				<ul className='video-list'>
					<li>test 1</li>
					<li>test 2</li>
					<li>test 3</li>
				</ul>
			/////////////////////////////////////////
				<input type='number' onChange={this.speedMultiplierChange.bind(this)} value={this.state.speedMultiplier}></input>
				<button>export</button>
			</form>
		)
	}
}

export default Form;