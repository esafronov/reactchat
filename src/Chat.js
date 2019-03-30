import React from "react";
import io from "socket.io-client";
import moment from 'moment/moment.js';

class Chat extends React.Component{
     constructor(props){
        moment.locale('ru');
		super(props);
		
		this.state = {
            username: props.username,
            message: '',
            messages: [],
			timestamp : null,
			isPrevious : true
        };
		
		this.socket = io('localhost:8080');
		
		this.socket.on('connect', () => {
			let now = new Date().getTime();
			this.setState({timestamp : now});
			this.sendPrevious('init');
		});

		this.socket.on('get_previous', data => {
			this.addPrevious(data);
		});
		
		this.sendPrevious = (action) => {
			console.log(action);
			this.socket.emit('send_previous', {	
				timestamp : this.state.timestamp,
				action : action
			});
		}
		
		this.addPrevious = data => {
			if(data.messages.length<10) {
				this.setState({
					isPrevious : false
				});
				if (data.messages.length===0) return;
			}
			data.messages.reverse();
			this.setState({
				timestamp : data.messages.length > 0 ? data.messages[0].timestamp : this.state.timestamp, 
				messages : [...data.messages,...this.state.messages]
			});
			if (data.action==='init') this.scrolldown();
		}		
		
		this.socket.on('get_message', data => {
			this.addMessage(data);
		});
		
		this.addMessage = data => {
			this.setState({messages : [...this.state.messages,data]});
			this.scrolldown();
		}
		
		this.sendMessage = ev => {
			if (!this.state.message) return false;
			ev.preventDefault();
			this.socket.emit('send_message', {
				author: this.state.username,
				message: this.state.message
			});
			this.setState({message: ''});
		}
		
		this.formatTime = time => {
			return moment(time).format('HH:mm:ss')
		}
		
		this.scrolldown = () => {			
			let el = document.getElementsByClassName('scrollable');
			let scrollHeight = Math.max(el[0].scrollHeight, el[0].clientHeight);
			el[0].scrollTop = scrollHeight - el[0].clientHeight;
		}
	}
	
	render(){
		return (
            <form>
				<h3>Chat</h3>
				<hr/>
				<div className="scrollable">
				<ul className="list-group">
					{this.state.isPrevious &&
						<li className="list-group-item">
							<button className="btn btn-primary" type="button" onClick={ev => {this.sendPrevious()}}>Load previous</button>
						</li>
					}
					{this.state.messages.map((message,index) => {
						return (
							<li className="list-group-item" key={index}>{this.formatTime(message.created)} <b>{message.author}</b><br/> {message.message}</li>
						)
					})}
				</ul>
				</div>
				<p></p>
				<div className="input-group">
				  <input value={this.state.message} onChange={ev => this.setState({message : ev.target.value})} type="text" placeholder="Message" required className="form-control"/>
				  <div className="input-group-append">
				  <button onClick={this.sendMessage}  type="submit" className="btn btn-primary form-control">Send</button>					
				  </div>
				</div>
			</form>  
        );
    }
}

export default Chat;