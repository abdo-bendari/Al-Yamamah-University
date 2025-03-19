"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const CourseSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    instructor: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    price: { type: Number, default: 0.0 },
    studentsEnrolled: { type: Number, default: 0 },
    content: [
        {
            moduleTitle: { type: String, required: true },
            videos: [
                {
                    title: { type: String, required: true },
                    videoUrl: { type: String, required: true },
                    materials: [{ type: String }],
                },
            ],
        },
    ],
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: "Category", required: true },
    reviews: {
        type: [
            {
                comment: { type: String, required: true },
                rating: { type: Number, required: true },
                user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
            },
        ],
        default: [],
    },
    rating: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false },
    creditHours: { type: Number, required: true },
    courseType: {
        type: String,
        enum: ["required", "elective"],
        required: true,
    },
    prerequisites: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Course" }],
    requirementType: { type: String, enum: ["college", "institution"] },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Course", CourseSchema);
