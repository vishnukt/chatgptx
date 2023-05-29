const asyncMiddleware = require('../../middlewares/asyncMiddleware');
const Response = require('../../middlewares/response');
const { TokenPlan, createTokenPlan, validateCreateTokenPlan } = require('../../models/token-plans.model');


/**
 * Create Token Plans
 * */
exports.createTokenPlan = asyncMiddleware(async (req, res, next) => {
    const { error } = validateCreateTokenPlan(req.body);
	if (error) {
		let response = Response('error', error.details[0].message);
		return res.status(response.statusCode).send(response);
	}

    let tokenPlan = new TokenPlan(req.body);
    tokenPlan = await tokenPlan.save();

	var response = Response('success', '', { tokenPlan });
	return res.send(response);
});
