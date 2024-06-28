const yup = require('yup');
const { ValidationError } = require('../errors');

const MESSAGES = {
    wrongType: (type) => `Must be ${type}`,
    missing: 'This field is required',
    tooShort: (min) => `Should be at least ${min} characters`
};

const userDataSchema = yup.object({
    username: yup.string()
        .typeError(MESSAGES.wrongType('a string'))
        .required(MESSAGES.missing)
        .min(4, MESSAGES.tooShort(4)),
    password: yup.string()
        .typeError(MESSAGES.wrongType('a string'))
        .required(MESSAGES.missing)
        .min(8, MESSAGES.tooShort(8))
});

const userValidator = async (req, resp, next) => {
    try {
        await userDataSchema.validate(req.body, { abortEarly: false });
        next();
    } catch (err) {
        const errors = err.inner.reduce((acc, curr) => {
            if (!acc[curr.path]) {
                acc[curr.path] = [];
            }

            acc[curr.path].push(curr.message);
            return acc;
        }, {});

        next(new ValidationError({ msg: 'Invalid user credentials format', errors }));
    }
}

module.exports = {
    userValidator
}