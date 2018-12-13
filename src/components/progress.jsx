import React, { Component } from 'react';

class Progress extends Component{
	render(){
		return (
			<div className='progress-container'>
				<div className='progress-bar'>
					<div className='progress-bar-loaded'></div>
					<div className='progress-bar-text'>13131%</div>
				</div>
			</div>
		)
	}
}

export default Progress;