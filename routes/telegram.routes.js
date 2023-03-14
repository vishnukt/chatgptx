const express = require('express');
const router = express.Router();
const telegramWebHookRepo = require('../repository/telegram/telegram-webhook.repo');


router.post('/webhook', (req, res, next) => {
	telegramWebHookRepo.telegramWebHookReceiver(req, res, next);
});


module.exports = router;
