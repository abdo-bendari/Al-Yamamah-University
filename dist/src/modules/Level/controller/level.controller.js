"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLevel = exports.updateLevel = exports.getLevelById = exports.getAllLevels = exports.createLevel = void 0;
const Level_1 = __importDefault(require("../../../../database/models/Level"));
const catchError_1 = __importDefault(require("../../../middleware/catchError"));
const Error_1 = require("../../../utils/Error");
exports.createLevel = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, courses, order, isPublished, prerequisiteCoursesCount } = req.body;
    if (!name || !courses || !order || !prerequisiteCoursesCount) {
        return next(new Error_1.AppError("Please provide all required fields", 400));
    }
    const existingLevel = yield Level_1.default.findOne({ name });
    if (existingLevel) {
        return next(new Error_1.AppError("Level already exists", 400));
    }
    const newLevel = yield Level_1.default.create({ name, courses, order, isPublished, prerequisiteCoursesCount });
    return res.status(201).json({
        status: "success",
        message: "Level created successfully",
        level: newLevel,
    });
}));
exports.getAllLevels = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const levels = yield Level_1.default.find()
        .sort({ order: 1 })
        .select("name order prerequisiteCoursesCount");
    return res.status(200).json({
        status: "success",
        results: levels.length,
        levels,
    });
}));
exports.getLevelById = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const level = yield Level_1.default.findById(id)
        .populate({
        path: "courses",
        select: "code title courseType prerequisites creditHours requirementType",
        populate: { path: "prerequisites", select: "code title" },
    })
        .select("-__v -createdAt -updatedAt");
    if (!level) {
        return next(new Error_1.AppError("Level not found", 404));
    }
    return res.status(200).json({ status: "success", level });
}));
exports.updateLevel = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedLevel = yield Level_1.default.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
    if (!updatedLevel) {
        return next(new Error_1.AppError("Level not found", 404));
    }
    return res.status(200).json({ status: "success", message: "Level updated successfully", level: updatedLevel });
}));
exports.deleteLevel = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedLevel = yield Level_1.default.findByIdAndDelete(id);
    if (!deletedLevel) {
        return next(new Error_1.AppError("Level not found", 404));
    }
    return res.status(200).json({ status: "success", message: "Level deleted successfully" });
}));
