import React, { Component } from 'react';
import Chat from './Chat';
import Login from './Login';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			logged : false,
			username: null
		};
		// Bind the this context to the handler function
		this.login = this.login.bind(this);
	}
  
	login(username){
		console.log(username);
		this.setState({
			logged: true, 
			username: username
		});
	}
  
	render() {
	let screen = '';
	if (this.state.logged)
		screen = <Chat username={this.state.username}/>
	else
		screen = <Login login={this.login}/>
	return (
	  <div>
		  <div className="container">
			  <div className="row">
				  <div className="col-4">
					<div className="card">
					  <div className="card-body">
						{screen}
					  </div>
					</div>
				  </div>
			  </div>
		  </div>
	  </div>
	);
	}
}

export default App;
