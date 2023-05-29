const mongoose = require('mongoose');


const tokenConsumptionHistorySchema = new mongoose.Schema(
    {
        promptTokens: {
            type: Number,
            required: true
        },
        completionTokens: {
            type: Number,
            required: true
        },
        totalTokens: {
            type: Number,
            required: true
        }
    },
    { timestamps: true },
)


/**
 * Chat Session Duration- 1 Hour
 */
const chatSessionSchema = new mongoose.Schema(
	{
        user: {
            type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
            required: true
        },
        chatId: {
            type: String,
            required: true,
            max: 128,
            trim: true,
            unique: true
        },
		startedOn: {
			type: Date, 
			required: true
		},
        endedOn: {
			type: Date,
			required: true
		},
        tokensConsumed: {
            type: Number,
            min: 0,
            default: 0
        },
        tokenConsumptionHistory: [ tokenConsumptionHistorySchema ]
	},
	{ timestamps: true },
);


chatSessionSchema.index({ user: 1 });
chatSessionSchema.index({ chatId: 1 });


exports.ChatSession = mongoose.model('ChatSession', chatSessionSchema);
