const express = require('express');
const app = express();
const config = require('../config.js');
module.exports.init = function() {
	return new Promise((resolve, reject) => {		
		const server = app.listen(config.port, function(){
			console.log(`express server is running on port ${config.port}`)
			module.exports.server = server;
			resolve(server);	
		});
	});
};