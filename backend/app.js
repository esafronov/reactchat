const socket = require('socket.io');
const config = require('./config.js');
const db = require('./modules/db.js');
const longt = require('mongodb').Long;
db.init()
.then(function(){
	const io = socket(config.port);
	io.on('connection', (socket) => {
		console.log(`${socket.id} connected`);
		socket.on('send_message', function(data){
			let col = db.client.collection(config.col.mes);
			data.created = new Date();
			let millis = new Date().getTime();
			data.timestamp = longt.fromNumber(millis);
			col.insertOne(data, (err, r) => {
				if (err) console.log(err);
			});
			io.emit('get_message', data);
//			console.log(data);
		});
		socket.on('send_previous', function(data){
			let col = db.client.collection(config.col.mes);
			col.find({timestamp:{"$lt":data.timestamp}})
				.sort({timestamp:-1})
				.limit(10)
				.toArray(function(err, items) {
					socket.emit('get_previous', {
						action : data.action,
						messages : items
					});
				});
		});
	});
}).catch(err => {
	console.log(err);
});