import React from "react";

class Login extends React.Component{
     constructor(props){
        super(props);

		this.state = {
			username: null
		};

		this.auth = ev => {
			if (!this.state.username) return false;
			ev.preventDefault();
			this.props.login(this.state.username);
		}

	}
	
	render(){
        
		return (
          <form>
			<h3>Login</h3>
			<hr/>
			<div className="input-group">
			  <input required onChange={ev => this.setState({username : ev.target.value})} type="text" className="form-control"  placeholder="Plase enter your name"/>
			  <div className="input-group-append">
				<button onClick={this.auth}  type="submit" className="btn btn-primary">Login</button>
			  </div>
			</div>
          </form>           
        );
    }
}

export default Login;