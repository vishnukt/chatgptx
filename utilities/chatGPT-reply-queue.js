const bullQueue = require('../services/bullQueue.service');
const config = require('../config/config');
const telegram = require('../services/telegram.service');
const chatGPT = require('../services/chatgpt.service');
const winston = require('winston');
const cache = require('../services/redis.service');


const chatGPTReplyQueue = bullQueue.createQueue(config.chatGPTReplyQueue);
// Exporting Queue, so that it can be accessed externally
exports.chatGPTReplyQueue = chatGPTReplyQueue;


chatGPTReplyQueue.process( async function (job, done) {
    try {
        if (!Object.keys(job.data).length) {
            done();

            return null;
        }

        console.log(`QUEUE - ${config.chatGPTReplyQueue}`, job.data);

        const chatGPTResponse = await chatGPT.ask(job.data.message);

        console.log('ChatGPT Response', chatGPTResponse);

        let message = chatGPTResponse ? chatGPTResponse.message : config.chatGPTErrorResponse;
        
        await telegram.sendMessage(message, job.data.chatId);

        // Removing rate limiter
        cache.delete(`TELEGRAM_CHAT_RATE_LIMIT_${job.data.chatId}`);

        // For Monitring
        await telegram.sendMessage(`Incoming ChatGPTX Message \n\nMessage:\n${JSON.stringify(job.data)}\n\nResponse:\n${JSON.stringify(chatGPTResponse)}`);

        done();
    } catch(error) {
        winston.error('chatGPTReplyQueue Process Error', error);

        return null;
    }
});
