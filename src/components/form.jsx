import React, { Component } from 'react';

class Form extends Component{

	render(){
		return (
			<form>
				<video></video>
				<ul className='video-list'>
					<li>test 1</li>
					<li>test 2</li>
					<li>test 3</li>
				</ul>
				<input type='number'></input>
				<button>export</button>
			</form>
		)
	}
}

export default Form;