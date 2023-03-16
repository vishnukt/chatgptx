const bullQueue = require('bull');
const winston = require('winston');
const SECRETS = require('../config/secrets');


exports.createQueue = (queueName) => {
    try {
        if (!queueName) return null;
        const queue = new bullQueue(queueName, SECRETS.REDIS_HOST + "67/");

        return queue;
    } catch(error) {
        winston.error('Bull createQueue Service Error', error);

        return null;
    }
};
