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
exports.removeCourseFromCategory = exports.addCourseToCategory = exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getAllCategories = exports.createCategory = void 0;
const Error_1 = require("./../../../utils/Error");
const catchError_1 = __importDefault(require("../../../middleware/catchError"));
const Category_1 = __importDefault(require("../../../../database/models/Category"));
const Course_1 = __importDefault(require("../../../../database/models/Course"));
exports.createCategory = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, courses } = req.body;
    if (!name) {
        return next(new Error_1.AppError("Category name is required", 400));
    }
    const existingCategory = yield Category_1.default.findOne({ name });
    if (existingCategory) {
        return next(new Error_1.AppError("Category already exists", 400));
    }
    const category = yield Category_1.default.create({ name, description, courses });
    return res.status(201).json({ status: "success", category });
}));
exports.getAllCategories = (0, catchError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield Category_1.default.find().select("-__v -createdAt -updatedAt").populate({
        path: "courses",
        select: "title code instructor",
        populate: { path: "instructor", select: "firstName lastName" }
    });
    return res.status(200).json({ status: "success", results: categories.length, categories });
}));
exports.getCategoryById = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const category = yield Category_1.default.findById(id).select("-__v -createdAt -updatedAt").populate({
        path: "courses",
        select: "title code instructor",
        populate: { path: "instructor", select: "firstName lastName" }
    });
    if (!category) {
        return next(new Error_1.AppError("Category not found", 404));
    }
    return res.status(200).json({ status: "success", category });
}));
exports.updateCategory = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = yield Category_1.default.findByIdAndUpdate(id, { name, description }, { new: true });
    if (!category) {
        return next(new Error_1.AppError("Category not found", 404));
    }
    return res.status(200).json({ status: "success", category });
}));
exports.deleteCategory = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const category = yield Category_1.default.findByIdAndDelete(id);
    if (!category) {
        return next(new Error_1.AppError("Category not found", 404));
    }
    return res.status(200).json({ status: "success", message: "Category deleted successfully" });
}));
exports.addCourseToCategory = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    const { courseId } = req.body;
    const category = yield Category_1.default.findById(categoryId);
    if (!category) {
        return next(new Error_1.AppError("Category not found", 404));
    }
    const course = yield Course_1.default.findById(courseId);
    if (!course) {
        return next(new Error_1.AppError("Course not found", 404));
    }
    category.courses.push(courseId);
    yield category.save();
    return res.status(200).json({ status: "success", message: "Course added to category successfully" });
}));
exports.removeCourseFromCategory = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    const { courseId } = req.body;
    const category = yield Category_1.default.findById(categoryId);
    if (!category) {
        return next(new Error_1.AppError("Category not found", 404));
    }
    const index = category.courses.indexOf(courseId);
    if (index !== -1) {
        category.courses.splice(index, 1);
        yield category.save();
        return res.status(200).json({ status: "success", message: "Course removed from category successfully" });
    }
    else {
        return next(new Error_1.AppError("Course not found in category", 404));
    }
}));
