"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const Payment_1 = require("../../../database/models/Payment");
exports.paymentValidation = joi_1.default.object({
    user: joi_1.default.string()
        .custom((value, helpers) => {
        return mongoose_1.default.Types.ObjectId.isValid(value)
            ? value
            : helpers.error("any.invalid");
    })
        .required(),
    level: joi_1.default.string()
        .custom((value, helpers) => {
        return mongoose_1.default.Types.ObjectId.isValid(value)
            ? value
            : helpers.error("any.invalid");
    })
        .allow(null),
    course: joi_1.default.string()
        .custom((value, helpers) => {
        return mongoose_1.default.Types.ObjectId.isValid(value)
            ? value
            : helpers.error("any.invalid");
    })
        .allow(null),
    amount: joi_1.default.number().positive().required(),
    currency: joi_1.default.string().trim().uppercase().default("USD"),
    status: joi_1.default.string()
        .valid(...Object.values(Payment_1.PaymentStatus))
        .default(Payment_1.PaymentStatus.PENDING),
    stripeSessionId: joi_1.default.string().trim().required(),
});
