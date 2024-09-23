import Joi from "joi";


export function addReportValidation(data) {
    const schema = Joi.object({
        name: Joi.string().required().min(2).max(80),
        email: Joi.string().email().required().max(80, 'utf8'),
        CNIC: Joi.string().pattern(/^\d{5}-\d{7}-\d{1}$/).allow(null, '').optional(),
        phone: Joi.string().pattern(/^\+\d{1,3}-\d{9}$/).allow(null, '').optional(),
        title: Joi.string().required().min(3).max(60),
        address: Joi.string().required(),
        city: Joi.string().required(),
        evidence: Joi.string().required(),
        date: Joi.date().required(),
        url: Joi.string().required().uri()
    });
    return schema.validate(data);
}