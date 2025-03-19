"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const courseValidationSchema = joi_1.default.object({
    title: joi_1.default.string().trim().min(3).max(100).required(),
    code: joi_1.default.string().trim().required(),
    description: joi_1.default.string().trim().min(10).max(1000).required(),
    instructor: joi_1.default.string()
        .custom((value, helpers) => {
        return mongoose_1.default.Types.ObjectId.isValid(value)
            ? value
            : helpers.error("any.invalid");
    })
        .required(),
    price: joi_1.default.number().min(0).optional(),
    studentsEnrolled: joi_1.default.number().integer().min(0).default(0),
    rating: joi_1.default.number().min(0).max(5).default(0),
    category: joi_1.default.string()
        .custom((value, helpers) => {
        return mongoose_1.default.Types.ObjectId.isValid(value)
            ? value
            : helpers.error("any.invalid");
    })
        .required(),
    isPublished: joi_1.default.boolean().default(false),
    isPaid: joi_1.default.boolean().default(false),
    creditHours: joi_1.default.number().integer().min(1).required(),
    courseType: joi_1.default.string().valid("required", "elective").required(),
    prerequisites: joi_1.default.array()
        .items(joi_1.default.string().custom((value, helpers) => {
        return mongoose_1.default.Types.ObjectId.isValid(value)
            ? value
            : helpers.error("any.invalid");
    }))
        .optional(),
    requirementType: joi_1.default.string().valid("college", "institution").optional(),
    content: joi_1.default.array()
        .items(joi_1.default.object({
        moduleTitle: joi_1.default.string().trim().required(),
        videos: joi_1.default.array()
            .items(joi_1.default.object({
            title: joi_1.default.string().trim().required(),
            videoUrl: joi_1.default.string().trim().uri().required(),
            materials: joi_1.default.array().items(joi_1.default.string().trim().uri()).optional(),
        }))
            .required(),
    }))
        .optional(),
    reviews: joi_1.default.array()
        .items(joi_1.default.object({
        comment: joi_1.default.string().trim().required(),
        rating: joi_1.default.number().min(1).max(5).required(),
        user: joi_1.default.string()
            .custom((value, helpers) => {
            return mongoose_1.default.Types.ObjectId.isValid(value)
                ? value
                : helpers.error("any.invalid");
        })
            .required(),
    }))
        .default([]),
});
exports.default = courseValidationSchema;
