const asyncMiddleware = require('../../middlewares/asyncMiddleware');
const Response = require('../../middlewares/response');
const telegram = require('../../services/telegram.service');


/**
 * Receive Telegram WebHooks
 * */
exports.telegramWebHookReceiver = asyncMiddleware(async (req, res, next) => {

    telegram.sendMessage(req.body);

	var response = Response('success');
	return res.send(response);
});
