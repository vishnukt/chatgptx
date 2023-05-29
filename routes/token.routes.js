const express = require('express');
const router = express.Router();
const tokenRepo = require('../repository/tokens/tokens.repository');


router.post('/', (req, res, next) => {
	tokenRepo.createTokenPlan(req, res, next);
});


module.exports = router;
