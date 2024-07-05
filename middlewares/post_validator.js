const yup = require('yup');
const { ValidationError } = require('../errors');

const MESSAGES = {
    wrongType: (type) => `Must be ${type}`,
    missing: 'This field is required',
    tooShort: (min) => `Should be at least ${min} characters`
};

const postSchema = yup.object({
    postTitle: yup.string()
        .typeError(MESSAGES.wrongType('a string'))
        .required(MESSAGES.missing)
        .min(6, MESSAGES.tooShort(6)),
    postContent: yup.string()
        .typeError(MESSAGES.wrongType('a string'))
        .required(MESSAGES.missing)
        .min(10, MESSAGES.tooShort(10))
});

const postValidator = async (req, resp, next) => {
    try {
        await postSchema.validate(req.body, { abortEarly: false });
        next();
    } catch (err) {
        const errors = err.inner.reduce((acc, curr) => {
            if (!acc[curr.path]) {
                acc[curr.path] = [];
            }
            acc[curr.path].push(curr.message);

            return acc;
        }, {});

        next(new ValidationError({ msg: 'Invalid post data format', errors }));
    }
}

module.exports = {
    postValidator
};