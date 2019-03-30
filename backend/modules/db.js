const mongoClient = require('mongodb').MongoClient;
const config = require('../config.js');
module.exports.init = function () {
	return new Promise((resolve, reject) => {		
		mongoClient.connect(config.mongodb.uri, {poolSize: 10, useNewUrlParser : true}, (err, client) => {
			if (err) return reject(err);
			module.exports.client = client.db(config.mongodb.db);
			console.log(`mongodb is connected to ${config.mongodb.db} database`);
			resolve();
		});	
	});
};
