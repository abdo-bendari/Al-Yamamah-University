"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation = (schema) => {
    return (req, res, next) => {
        const inputData = Object.assign(Object.assign(Object.assign({}, req.body), req.params), req.query);
        const { error } = schema.validate(inputData, { abortEarly: false });
        if (error) {
            res.status(400).json({ message: "Validation error", error: error.details });
            return;
        }
        next();
    };
};
exports.default = validation;
