import React from "react";
import io from "socket.io-client";
import moment from 'moment/moment.js';
import 'moment/locale/ru';
import { config } from './config.js';

class Chat extends React.Component{
     constructor(props){
        
		/*
		set moment localization
		*/
		moment.locale('ru');
		
		super(props);
		
		/*
		default react data
		*/
		this.state = {
            username: props.username,
            message: '',
            messages: [],
			timestamp : null,
			isPrevious : true, //show or hide previous button
			init : false //is chat initialized
        };
		
		/*
		connect to chat server
		*/
		this.socket = io(config.server);
		
		this.socket.on('connect', () => {
			let now = new Date().getTime();
			//set current timestamp
			this.setState({
				timestamp : now
			});
			//request previous messages on init
			if (!this.state.init) this.sendPrevious('init');
		});

		/*
		incoming socket event from server
		*/
		this.socket.on('get_previous', data => {
			//add requested messages
			this.addPrevious(data);
		});
		
		/*
		request previous messages from server
		*/
		this.sendPrevious = (action) => {
			this.socket.emit('send_previous', {	
				timestamp : this.state.timestamp,
				action : action
			});
		}
		
		/*
		add incoming messages to react state
		*/
		this.addPrevious = data => {
			//show or hide load previous button depend on incoming messages count
			if(data.messages.length<10) {
				this.setState({
					isPrevious : false
				});
				if (data.messages.length===0) return;
			}
			data.messages.reverse();
			//change chat window timestamp
			this.setState({
				timestamp : data.messages.length > 0 ? data.messages[0].timestamp : this.state.timestamp, 
				messages : [...data.messages,...this.state.messages]
			});
			//call scroll down chat only on chat initialization
			if (data.action==='init') {
				this.setState({
					init : true
				});
				this.scrolldown();
			}
		}		
		
		/*
		incoming socket event from server
		*/
		this.socket.on('get_message', data => {
			this.addMessage(data);
		});
		
		/*
		add incoming message to react state
		*/
		this.addMessage = data => {
			this.setState({messages : [...this.state.messages,data]});
			this.scrolldown();
		}
		
		/*
		send message to chat server for broadcasting
		*/
		this.sendMessage = ev => {
			if (!this.state.message) return false;
			ev.preventDefault();
			this.socket.emit('send_message', {
				author: this.state.username,
				message: this.state.message
			});
			this.setState({message: ''});
		}
		
		/*
		format message time with moment
		*/
		this.formatTime = time => {
			return moment(time).format('D MMM HH:mm:ss')
		}
		
		/*
		scroll down chat
		*/
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
							<li className="list-group-item" key={index}>
							<small>{this.formatTime(message.created)} <b>{message.author}</b></small><br/> 
							<i>{message.message}</i></li>
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