const Response = require('../middlewares/response');
const cache = require('../services/redis.service');
const winston = require('winston');
const Joi = require('joi');
const telegram = require('../services/telegram.service');
const config = require('../config/config');


function validateTelegramWebhookData(data) {
	const schema = Joi.object({
        updateId: Joi.number().min(0).required(),
        messageId: Joi.number().min(0).required(),
        chatId: Joi.number().min(0).required(),
        message: Joi.string().required()
	});

	return schema.validate(data);
};


/**
 * Validate Telegram WebHooks
 */
module.exports = async (req, res, next) => {
	try {
        console.log('Incomming WebHook(Raw)', req.body);
    
        let data = {
            updateId: req.body.update_id,
            messageId: req.body.message.message_id,
            chatId: req.body.message.from.id,
            message: req.body.message.text
        }

        const { error } = validateTelegramWebhookData(data);
        if (error) {
            winston.error('Telegram WebHook Validation Error', error.details[0].message);

            let response = Response('success');
            return res.status(response.statusCode).send(response);
        }

        // Avoiding duplicate requests
        if (await cache.get(`TELEGRAM_CHAT_UPDATE_ID_${data.updateId}`)) {
            let response = Response('success');
			return res.status(response.statusCode).send(response);
        }
        // Rate Limiting (Only one message per 30 seconds for a chat)
        if (await cache.get(`TELEGRAM_CHAT_RATE_LIMIT_${data.chatId}`)) {
            await telegram.sendMessage(config.chatGPTRateLimitResponse, data.chatId);

            let response = Response('success');
			return res.status(response.statusCode).send(response);
        }

        cache.set(`TELEGRAM_CHAT_UPDATE_ID_${data.updateId}`, 'dummy', 3600);
        cache.set(`TELEGRAM_CHAT_RATE_LIMIT_${data.chatId}`, 'dummy', 30);

        req.body = data;

        console.log("INCOMMING WEBHOOK", data);

		next();
	} catch(ex) {
        winston.error('Telegram WebHook Validator Middleware Error', ex);

		let response = Response('error', 'Invalid WebHook', {}, 401);
		return res.status(response.statusCode).send(response);
	}
};
