const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const error = require('../middlewares/error');


const telegram = require('../routes/telegram.routes');
const token = require('../routes/token.routes');
const test = require('../routes/test.routes');


module.exports = function(app) {
	app.use(helmet());
	app.use(cors());
	app.use(express.json({ limit: '2mb' }));
	app.use(express.urlencoded({ limit: '2mb', extended: true }));
	app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)

	app.use('/telegram', telegram);
	app.use('/tokens', token);
	app.use('/test', test);
	app.use(error);
};
