const mongoose = require('mongoose');


const userSchema = new mongoose.Schema(
	{
        chatId: {
            type: String,
            required: true,
            max: 128,
            trim: true,
            unique: true
        },
		name: {
			type: String,
			max: 128,
			trim: true,
			default: ''
		},
        username: {
			type: String,
			max: 128,
			trim: true,
			default: ''
		},
		phone: {
			type: String,
			trim: true,
			unique: true,
			match: /^[0-9]{10}$/
		},
		currentPlan: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'PurchasedTokenPlan',
			required: true
		},
        availableTokens: {
            type: Number,
			min: 0,
            default: 0
        },
        totalTokensConsumed: {
            type: Number,
            min: 0,
            default: 0
        }
	},
	{ timestamps: true },
);


userSchema.index({ chatId: 1 });
userSchema.index({ phone: 1 });


exports.User = mongoose.model('User', userSchema);
