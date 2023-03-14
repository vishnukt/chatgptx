const winston = require('winston');
const Response = require('../middlewares/response');


/**
 * Any exceptions thrown in the app will end up in here
 * Here we log it to our logging DB/File
 * Return a structured response to the end user
 */
module.exports = async (err, req, res, next) => {
	try {
		// Log the exception
		winston.error(err.message, err);

		// Send response
		let response = Response('error', 'Sorry, Something went wrong', {}, 500);
		res.status(response.statusCode).send(response);
	} catch(error) {}
};
