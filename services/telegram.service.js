const axios = require('axios');
const winston = require('winston');
const SECRETS = require('../config/secrets');


/**
 * Telegram notification  
 * @param {string} message 
 * @param {string} chatId  
 */
exports.sendMessage = async (message, chatId, messageId) => {
	try {
		if (!message) return null;

		// message = JSON.stringify(message);

		let apiKey = SECRETS.TELEGRAM_CHATGPT_BOT_API_KEY;

		if (!chatId) {
			chatId = SECRETS.TELEGRAM_CHAT_ID;
			apiKey = SECRETS.TELEGRAM_GIDEON_BOT_API_KEY
		}

		let data = { 'chat_id': chatId };

		if (messageId) data['reply_to_message_id'] = messageId;

		while (true) {
			if (message.length > 3999) {
				data['text'] = message.substring(0, 3999);
				message = message.substring(3999);

				await axios.post(`https://api.telegram.org/bot${apiKey}/sendMessage`, data);
			} else if(message.length > 0) {
				data['text'] = message;
		
				await axios.post(`https://api.telegram.org/bot${apiKey}/sendMessage`, data);
				break;
			} else break;
		}

		return 'success';
	} catch (error) {
		winston.error('Telegram Service Error');
		return null;
	}
};
