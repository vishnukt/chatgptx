const Joi = require('joi');
const mongoose = require('mongoose');


const tokenPlanSchema = new mongoose.Schema(
	{
        planId: {
            type: String,
            required: true,
            max: 128,
			unique: true,
            trim: true
        },
		planName: {
			type: String,
			required: true
		},
		price: {
            type: Number,
			min: 0,
            required: true
        },
        tokens: {
            type: Number,
			min: 0,
            required: true
        },
		isAvailable: {
			type: Boolean,
			default: true
		}
	},
	{ timestamps: true },
);


exports.TokenPlan = mongoose.model('TokenPlan', tokenPlanSchema);


exports.validateCreateTokenPlan = (data) => {
	const schema = Joi.object({
		planId: Joi.string().required(),
		planName: Joi.string().required(),
		price: Joi.number().min(0).required(),
		tokens: Joi.number().min(1).integer().required(),
		isAvailable: Joi.boolean().default(true)
	});
	return schema.validate(data);
};
