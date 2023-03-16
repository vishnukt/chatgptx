const express = require('express');
const router = express.Router();
const testRepo = require('../repository/test/test.repo');


router.post('/', (req, res, next) => {
	testRepo.testAPI(req, res, next);
});


module.exports = router;
