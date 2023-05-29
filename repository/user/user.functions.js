const winston = require('winston');
const { User } = require('../../models/user.models');
const cache = require('../../services/redis.service');
const config = require('../../config/config');


/**
 * Return User Details if exists
 * @param {integer} chatId 
 * @returns userData
 */
exports.getUserData = async (chatId, getFromCache=true) => {
    try {
        if (!chatId) return null;
        
        let userData = null;

        if (getFromCache) userData = await cache.get(`USER_CHAT_ID_${chatId}`);

        if (!userData) {
            userData = await User.findOne({ chatId: chatId }).lean();

            cache.set(`USER_CHAT_ID_${chatId}`, userData, 43200);
        }

        return userData;
    } catch(error) {
        winston.error('isUserExists function error', error);

        return null;
    }
}


/**
 * Create User, if not exists
 * @param {integer} chatId 
 * @param {string} name 
 * @param {string} username 
 * @returns userData
 */
exports.createUser = async (chatId, name, username) => {
    try {
        if (!chatId) return null;

        let userData = await this.getUserData(chatId);

        if (userData) return userData;

        userData = new User({
            chatId: chatId,
            name: name,
            username: username,
            availableTokens: config.initialUserTokens
        });
        userData = await userData.save();

        return userData.toJSON();
    } catch(error) {
        winston.error('createUser function error', error);

        return null;
    }
}
