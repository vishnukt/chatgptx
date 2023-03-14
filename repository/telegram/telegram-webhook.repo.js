const asyncMiddleware = require('../../middlewares/asyncMiddleware');
const Response = require('../../middlewares/response');
const telegram = require('../../services/telegram.service');
const chatGPT = require('../../services/chatgpt.service');


/**
 * Receive Telegram WebHooks
 * */
exports.telegramWebHookReceiver = asyncMiddleware(async (req, res, next) => {

    let telegramChatId = req.body.message.from.id;
    let message = req.body.message.text;

    const chatGPTResponse = await chatGPT.ask(message);

    await telegram.sendMessage(chatGPTResponse.message, telegramChatId);

	var response = Response('success');
	return res.send(response);
});
