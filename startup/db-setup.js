const { TokenPlan } = require('../models/token-plans.model');
const config = require('../config/config');


module.exports = async () => {
    // Setting Up Trial Plan if not present
    let trialPlan = await TokenPlan.findOne({ planId: config.TRIAL_TOKEN_PLAN_ID }, '_id').lean();

    if (!trialPlan) {
        trialPlan = new TokenPlan({
            planId: config.TRIAL_TOKEN_PLAN_ID,
            planName: 'Trial Plan',
            price: 0,
            tokens: config.TRIAL_TOKEN_PLAN_TOKENS,
            isAvailable: true
        });
        trialPlan = await trialPlan.save();
    }

    return '';
};
