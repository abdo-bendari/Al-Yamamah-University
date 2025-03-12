"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const userValidationSchema = joi_1.default.object({
    role: joi_1.default.string()
        .valid("student", "faculty", "organization", "admin")
        .required(),
    firstName: joi_1.default.string().trim().min(2).max(50).required(),
    lastName: joi_1.default.string().trim().min(2).max(50).required(),
    phone: joi_1.default.string()
        .pattern(/^\+?\d{10,15}$/)
        .required(),
    email: joi_1.default.string().email().lowercase().trim().required(),
    password: joi_1.default.string()
        .min(6)
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()-_+=]{6,}$/)
        .required()
        .messages({
        "string.pattern.base": "Password must contain at least one letter, one number, and no spaces. Special characters are allowed but not required.",
    }),
    timezone: joi_1.default.string().required(),
    otpCode: joi_1.default.string().optional(),
    otpExpires: joi_1.default.date().optional(),
    profilePic: joi_1.default.string().uri().optional(),
});
exports.default = userValidationSchema;
