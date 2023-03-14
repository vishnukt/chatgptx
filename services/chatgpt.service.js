const winston = require('winston');
const SECRETS = require('../config/secrets');
const { Configuration, OpenAIApi } = require("openai");


const configuration = new Configuration({
  apiKey: SECRETS.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


/**
 * OpenAI ChatGPT Ask
 * @param {string} message 
 * @returns { message, usage }
 */
exports.ask = async (message) => {
	try {
		if (!message) return null;

		const completion = await openai.createChatCompletion(
			{
				model: "gpt-3.5-turbo",
				messages: [{ role: "user", content: message }]
		  	}
		);

		let response = {
			message: completion.data.choices[0].message.content,
			usage: completion.data.usage
		};

		return response;
	} catch (error) {
		winston.error('ChatGPT Service Error', error);
		return null;
	}
};
