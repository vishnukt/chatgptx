const mongoose = require('mongoose');
const winston = require('winston');
const SECRETS = require('../config/secrets');


const dbUrl = SECRETS.DB_URL;


module.exports = () => {

	mongoose.set('strictQuery', false);
	mongoose.connect(dbUrl);

	mongoose.connection.on('connected', () => {
		console.log(`connected to mongoDB ${ dbUrl }`);
		winston.info(`connected to mongoDB ${ dbUrl }`);
	});

	// mongoose.set('debug', true);

	mongoose.connection.on('error', (err) => {
		console.log(`MongoDB has occured ${ err }`);
		winston.error(`MongoDB has occured ${ err }`);
	});

	mongoose.connection.on('disconnected', () => {
		winston.info('MongoDB disconnected');
	});

	process.on('SIGINT', () => {
		mongoose.connection.close(() => {
			winston.error('MongoDB is disconnected due to application termination');
			process.exit(0);
		});
	});
};
