const express = require('express');
const router = express.Router();
const telegramWebHookRepo = require('../repository/telegram/telegram-webhook.repo');
const telegramWebHookValidator = require('../middlewares/telegram-webhook-validator');


router.post('/webhook', telegramWebHookValidator, (req, res, next) => {
	telegramWebHookRepo.telegramWebHookReceiver(req, res, next);
});


module.exports = router;
