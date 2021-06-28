const { request, response } = require('express');
const { validationResult } = require('express-validator');

const validateFields = (req = request, res = response, next) => {
    const err = validationResult(req);

    if (!err.isEmpty()) {
        return res.status(400).json({
            errors: err.errors,
        });
    }

    next();
}

module.exports = { validateFields }