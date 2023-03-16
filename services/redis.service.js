const Redis = require('ioredis');
const winston = require('winston');
const SECRETS = require('../config/secrets');


/**
 * Redis connection will be served from here
 * @returns {Object} redis object
 */
async function redisConnection() {
	try {
		const client = await new Redis(SECRETS.REDIS_HOST);

		client.on('connect', () => {
			// console.log(`connected to Redis ${ SECRETS.REDIS_HOST } `);
			// winston.info(`connected to Redis ${ SECRETS.REDIS_HOST }`);
		});
        
		client.on('error', (err) => {
			console.log(`Redis has occurred - ${SECRETS.REDIS_HOST}, ${ err }`);
			winston.error(`Redis has occurred ${ err }`);
		});

		return client;
	} catch (error) {
		winston.error(`Redis Connection Service Error ${ error }`);
		return null;
	}
};


/**
 * Retrieve cache value for a key
 * @param {string} key
 * @returns {Object}
 */
exports.get = async (key) => {
	try {
		const redis = await redisConnection();

		var value = await redis.get(key);

		await redis.disconnect();
        
		// Converting to JSON Object
		try {
			value = JSON.parse(value);
		} catch {}

		return value;
	} catch (error) {
		winston.error('Redis Service - get error', error);
		return null;
	}
};


/**
 * Set cache value for a key
 * @param {string} key 
 * @param {string} value 
 * @param {number} expiry 
 * @returns 
 */
exports.set = async (key, value, expiry = 300) => {
	try {
		const redis = await redisConnection();

		// Converting to String
		value = JSON.stringify(value);

		await redis.set(key, value, 'ex', expiry);

		await redis.disconnect();

		return 'success';
	} catch (error) {
		winston.error('Redis Service - set error', error);
		return null;
	}
};


/**
 * Delete cache
 * @param {string} key 
 */
exports.delete = async (key) => {
	try {
		const redis = await redisConnection();

		await redis.del(key);
        
		await redis.disconnect();

		return 'success';
	} catch (error) {
		winston.error('Redis Service - delete error', error);
		return null;
	}
};


/**
 * Keys
 * @param {string} key
 */
exports.keys = async (key) => {
	try {
		const redis = await redisConnection();

		var keys = await redis.keys(key);

		await redis.disconnect();

		// Converting to JSON Object
		try {
			keys = JSON.parse(keys);
		// eslint-disable-next-line no-empty
		} catch {}

		return keys;
	} catch (error) {
		winston.error('Redis Service - keys error', error);
		return null;
	}
};


/**
 * Get TTL
 * @param {string} key 
 */
exports.ttl = async (key) => {
	try {
		const redis = await redisConnection();

		let ttl = await redis.ttl(key);
        
		await redis.disconnect();

		return ttl;
	} catch (error) {
		winston.error('Redis Service - ttl error', error);
		return null;
	}
};
