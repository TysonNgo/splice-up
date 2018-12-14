import React, { Component } from 'react';

class Progress extends Component{
	constructor(props){
		super(props);
		this.state = {
			text: '',
			progress: 0,
			active: false
		};
	}

	componentDidMount(){
		this.props.ipc.on('progress', (e, d) => {
			if (d.progress === 'end') {
				return this.setState({
					text: 'video exported!',
					progress: 100,
					active: false
				})
			} else {
				this.setState({active: true});
			}
			let progress = (this.hhmmssToSeconds(d.out_time)/d.out_time_final * 100).toFixed(1);
			this.setState({
				text: `processed: ${d.out_time} | ` +
				`size: ${this.humanFileSize(d.total_size)}`+
				`${d.bitrate === 'N/A' ? '' : ' | bitrate: '+d.bitrate}`,
				progress: progress
			});
		})
	}

	// https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string#answer-14919494
	humanFileSize(bytes, si) {
		let thresh = si ? 1000 : 1024;
		if(Math.abs(bytes) < thresh) {
			return bytes + ' B';
		}
		let units = si
			? ['kB','MB','GB','TB','PB','EB','ZB','YB']
			: ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
		let u = -1;
		do {
			bytes /= thresh;
			++u;
		} while(Math.abs(bytes) >= thresh && u < units.length - 1);
		return bytes.toFixed(1)+' '+units[u];
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
				<div className={this.state.active ? 'progress-bar active' : 'progress-bar'}>
					<div className='progress-bar-loaded' style={{width: this.state.progress + '%'}}></div>
					<div className='progress-bar-text'>{this.state.progress ? this.state.progress + '%' : ''}</div>
				</div>
				<div className='progress-text'>{this.state.text}</div>
			</div>
		)
	}
}

export default Progress;