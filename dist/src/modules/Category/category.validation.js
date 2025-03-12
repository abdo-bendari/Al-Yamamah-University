"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const categoryValidation = joi_1.default.object({
    name: joi_1.default.string().trim().min(2).max(100).required(),
    description: joi_1.default.string().trim().max(500),
    courses: joi_1.default.array().items(joi_1.default.string().custom((value, helpers) => {
        return mongoose_1.default.Types.ObjectId.isValid(value)
            ? value
            : helpers.error("any.invalid");
    })),
});
exports.default = categoryValidation;
