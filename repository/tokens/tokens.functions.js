const winston = require('winston');
const mongoose = require('mongoose');
const { User } = require('../../models/user.models');
const cache = require('../../services/redis.service');
const config = require('../../config/config');
const { TokenPlan } = require('../../models/token-plans.model');
const { PurchasedTokenPlan } = require('../../models/purchased-token-plans.model');
const { getUserData } = require('../user/user.functions');


exports.assignUserTokenPlan = async (chatId, tokenPlanId) => {
    try {
        if (!userId || !tokenPlanId) return null;

        let userData = await getUserData(chatId);
        if (!userData) return null;

        let tokenPlan = await TokenPlan.findOne({ planId: tokenPlanId }).lean();
        if (!tokenPlan) return null;

        let purchasedTokenPlan = new PurchasedTokenPlan({
            chatId: userData,chatId,
            user: userData._id,
            usertokenPlan: tokenPlan._id,
            tokens: tokenPlan.tokens,
            price: tokenPlan.price
        });
        
        const session = await mongoose.startSession();
		await session.startTransaction();

        let userUpdateResponse = await User.updateOne(
            { _id: userData._id },
            {
                $set: {
                    currentPlan: purchasedTokenPlan._id,
                    
                },
                $inc: {
                    availableTokens: purchasedTokenPlan.tokens
                }
            }
        );

        purchasedTokenPlan = await purchasedTokenPlan.save({ session: session });


        

        return 'success';
    } catch(error) {
        winston.error('assignUserTokenPlan function error', error);

        return null;
    }
}
