const bullQueue = require('../services/bullQueue.service');
const config = require('../config/config');
const telegram = require('../services/telegram.service');
const chatGPT = require('../services/chatgpt.service');
const winston = require('winston');


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

        await telegram.sendMessage(chatGPTResponse.message);

        done();
    } catch(error) {
        winston.error('chatGPTReplyQueue Process Error', error);

        return null;
    }
});
