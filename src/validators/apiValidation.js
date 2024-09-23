import Joi from "joi";

export const apiValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().optional().allow(''),
        CNIC: Joi.string().pattern(/^\d{5}-\d{7}-\d{1}$/, "cnic must be in (xxxxx-xxxxxxx-x)").allow(null, '').optional(),
        phone: Joi.string().pattern(/^\+\d{1,3}-\d{9}$/, "phone must be in (+923-123456789)").allow(null, '').optional(),
    })
    return schema.validate(data)
}