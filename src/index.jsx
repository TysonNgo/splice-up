import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import './static/scss/custom.scss';

import Progress from './components/progress';
import Form from './components/form';

class App extends Component{
	constructor(props){
		super(props);
		this.ipc = window.require('electron').ipcRenderer;
	}

	render(){
		return (
		<div>
			<Form ipc={this.ipc}></Form>
			<br></br>
			<Progress ipc={this.ipc}></Progress>
		</div>
		)
	}
};

ReactDOM.render(<App />, document.getElementById('root'));