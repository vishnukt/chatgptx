const mongoose = require('mongoose');


const purchasedTokenPlanSchema = new mongoose.Schema(
	{
        chatId: {
            type: String,
            required: true,
            max: 128,
            trim: true
        },
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		usertokenPlan: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'TokenPlan',
			required: true
		},
        tokens: {
            type: Number,
			min: 0,
            required: true
        },
		price: {
            type: Number,
			min: 0,
            required: true
        },
		consumedTokens: {
            type: Number,
			min: 0,
			default: 0,
            required: true
        },
		isExpired: {
			type: Boolean,
			default: false
		}
	},
	{ timestamps: true },
);


purchasedTokenPlanSchema.index({ user: 1 });
purchasedTokenPlanSchema.index({ chatId: 1 });


exports.PurchasedTokenPlan = mongoose.model('PurchasedTokenPlan', purchasedTokenPlanSchema);
