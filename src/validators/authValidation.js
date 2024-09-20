import Joi from "joi"

export function signUpValidation(user) {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        email: Joi.string().email().required().max(80, 'utf8'),
        password: Joi.string().min(8).required()
    })
    return schema.validate(user)
}
export function loginValidation(user) {
    const schema = Joi.object({
        email: Joi.string().email().required().max(80, 'utf8'),
        password: Joi.string().min(8).required()
    })
    return schema.validate(user)
}
export function forgetPasswordValidation(user) {
    const schema = Joi.object({
        email: Joi.string().email().required().max(80, 'utf8')
    })
    return schema.validate(user)
}

export function changePasswordValidation(password) {
    const schema = Joi.object({
        oldPassword: Joi.string().min(8).required(),
        newPassword: Joi.string().min(8).required()
    })
    return schema.validate(password)
}
