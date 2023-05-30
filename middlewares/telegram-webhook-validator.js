const Response = require('../middlewares/response');
const cache = require('../services/redis.service');
const winston = require('winston');
const Joi = require('joi');
const telegram = require('../services/telegram.service');
const config = require('../config/config');
const { createUser, getUserData } = require('../repository/user/user.functions');
const { assignUserTokenPlan } = require('../repository/tokens/tokens.functions');


function validateTelegramChatData(data) {
	const schema = Joi.object({
        updateId: Joi.number().min(0).required(),
        messageId: Joi.number().min(0).required(),
        chatId: Joi.number().min(0).required(),
        message: Joi.string().required(),
        chatType: Joi.string().valid('private').required(),
        // User Details
        userData: Joi.object().keys({
            firstName: Joi.string().max(128),
            lastName: Joi.string().max(128),
            userName: Joi.string().max(128)
        })
	});

	return schema.validate(data);
};


function validateTelegramContactNumberData(data) {
	const schema = Joi.object({
        updateId: Joi.number().min(0).required(),
        messageId: Joi.number().min(0).required(),
        chatId: Joi.number().min(0).required(),
        chatType: Joi.string().valid('private').required(),
        // User Details
        userData: Joi.object().keys({
            firstName: Joi.string().max(128),
            lastName: Joi.string().max(128),
            userName: Joi.string().max(128),
            phoneNumber: Joi.string().length(12).pattern(/^[0-9]+$/).required()
        }),
	});

	return schema.validate(data);
};


/**
 * Validate User Telegram Chat
 * @param {Object} req 
 * @returns { data, status }
 */
async function validateTelegramChat(req) {
    try {
        let data = {
            updateId: req.body.update_id,
            messageId: req.body.message.message_id,
            chatId: req.body.message.from.id,
            message: req.body.message.text,
            chatType: req.body.message.chat.type,
            userData: {
                firstName: req.body.message.chat.first_name,
                lastName: req.body.message.chat.last_name,
                userName: req.body.message.chat.username,
            }
        }

        const { error } = validateTelegramChatData(data);
        if (error) {
            winston.error('Telegram WebHook Validation Error', error.details[0].message);

            return { data: null, status: false };
        }

        // Avoiding duplicate requests
        if (await cache.get(`TELEGRAM_CHAT_UPDATE_ID_${data.updateId}`)) return { data: null, status: false };
        // Rate Limiting (Only one message per 30 seconds for a chat)
        if (await cache.get(`TELEGRAM_CHAT_RATE_LIMIT_${data.chatId}`)) {
            await telegram.sendMessage(config.chatGPTRateLimitResponse, data.chatId);

            return { data: null, status: false };
        }

        cache.set(`TELEGRAM_CHAT_UPDATE_ID_${data.updateId}`, 'dummy', 3600);
        cache.set(`TELEGRAM_CHAT_RATE_LIMIT_${data.chatId}`, 'dummy', 30);

        let userData = await getUserData(data.chatId);
        if (!userData) {
            userData = await createUser(
                data.chatId, data.userData.firstName + data.userData.lastName,
                data.userData.userName
            );

            // Assigning User Trial Token Plan
            await assignUserTokenPlan(data.chatId, config.TRIAL_TOKEN_PLAN_ID);

            if (!userData) throw new Error('User Creation Failed');
        }

        return { data, status: true };
    } catch(ex) {
        winston.error('Telegram WebHook Validator Middleware validateTelegramChat Error', ex);

		return { data: null, status: false };
    }
}


/**
 * Validate User Telegram Phone Number
 * @param {Object} req 
 * @returns { data, status }
 */
async function validateTelegramContactNumber(req) {
    let data = {
        updateId: req.body.update_id,
        messageId: req.body.message.message_id,
        chatId: req.body.message.from.id,
        chatType: req.body.message.chat.type,
        userData: {
            firstName: req.body.message.chat.first_name,
            lastName: req.body.message.chat.last_name,
            userName: req.body.message.chat.username,
            phoneNumber: req.body.message.contact.phone_number
        }
    }

    const { error } = validateTelegramContactNumberData(data);
    if (error) {
        winston.error('Telegram WebHook Validation Error', error.details[0].message);

        return { data, status: false }
    }



    return { data, status: true }
}


/**
 * Validate Telegram WebHooks
 */
module.exports = async (req, res, next) => {
	try {
        winston.info('Incomming WebHook(Raw)', req.body);

        await telegram.sendMessage('Incomming WebHook(Raw)\n\n' + JSON.stringify(req.body));

        let data = null;
        let status = false;

        if (req.body.message.text) {
            let validatedTelegramChat = await validateTelegramChat(req);

            data = validatedTelegramChat.data;
            status = validatedTelegramChat.status;

            if (!status) {
                let response = Response('success');
                return res.status(response.statusCode).send(response);
            }
        } else if (req.body.message.contact) {
            let validatedTelegramContactNumber = await validateTelegramContactNumber(req);

            data = validatedTelegramContactNumber.data;
            status = validatedTelegramContactNumber.status;

            if (!status) {
                let response = Response('success');
                return res.status(response.statusCode).send(response);
            }
        } else {
            winston.error('Telegram WebHook Validator - Unknown WebHook', req.body);

            let response = Response('success');
            return res.status(response.statusCode).send(response);
        }

        req.body = data;

        winston.info('INCOMMING WEBHOOK', data);

		next();
	} catch(ex) {
        winston.error('Telegram WebHook Validator Middleware Error', ex);

		let response = Response('success', 'Invalid WebHook');
		return res.status(response.statusCode).send(response);
	}
};
