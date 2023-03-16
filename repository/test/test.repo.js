const asyncMiddleware = require('../../middlewares/asyncMiddleware');
const Response = require('../../middlewares/response');
const { chatGPTReplyQueue } = require('../../utilities/chatGPT-reply-queue');


/**
 * Test out features API
 * */
exports.testAPI = asyncMiddleware(async (req, res, next) => {

    chatGPTReplyQueue.add({
        chatId: req.body.chatId,
        message: req.body.message
    });

	var response = Response('success');
	return res.send(response);
});
