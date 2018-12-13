import React, { Component } from 'react';

class Progress extends Component{
	constructor(props){
		super(props);
		this.state = {
			progress: 53
		};
	}

	componentDidMount(){
		// TODO
		// ipc on progress
		// set state progress (out_time convert to seconds)/out_time_final * 100
		this.props.ipc.on('progress', (e, args) => {
		})
	}

	hhmmssToSeconds(t){
		if (/^\d\d:\d\d:\d\d\.\d+$/.test(t)){
			let [h, m, s] = t.split(':')
			h = Number(h) * 60 * 60;
			m = Number(m) * 60;
			s = h + m + Number(s);
			return s;
		}
		return 0;
	}

	render(){
		return (
			<div className='progress-container'>
				<div className='progress-bar'>
					<div className='progress-bar-loaded' style={{width: this.state.progress + '%'}}></div>
					<div className='progress-bar-text'>{this.state.progress}%</div>
				</div>
				<div className='progress-text'>test</div>
			</div>
		)
	}
}

export default Progress;