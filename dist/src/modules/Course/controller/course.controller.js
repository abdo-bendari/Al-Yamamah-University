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
exports.deleteCourse = exports.updateCourse = exports.getCourseReviews = exports.addCourseReview = exports.getCoursesByCategory = exports.getCoursesByInstructor = exports.getCourseByTitleOrDescription = exports.getCourseById = exports.getAllCourses = exports.createCourse = void 0;
const catchError_1 = __importDefault(require("../../../middleware/catchError"));
const Error_1 = require("../../../utils/Error");
const Course_1 = __importDefault(require("../../../../database/models/Course"));
exports.createCourse = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, code, description, instructor, price, content, category, isPublished, creditHours, courseType, prerequisites, requirementType, } = req.body;
    if (!title || !code || !description || !instructor || !price || !content || !category || !isPublished || !creditHours || !courseType || !requirementType) {
        return next(new Error_1.AppError("Please provide all required fields", 400));
    }
    const existingCourse = yield Course_1.default.findOne({ title });
    if (existingCourse) {
        return next(new Error_1.AppError("Course already exists", 400));
    }
    const newCourse = yield Course_1.default.create({
        title,
        code,
        description,
        instructor,
        price,
        content,
        category,
        isPublished,
        creditHours,
        courseType,
        prerequisites,
        requirementType,
    });
    return res.status(201).json({ message: "Course created successfully", newCourse });
}));
exports.getAllCourses = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { page, limit } = req.query;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 6;
    const skip = (pageNumber - 1) * limitNumber;
    const courses = yield Course_1.default.find().skip(skip).limit(limitNumber).select("-__v -createdAt -updatedAt");
    if (courses.length === 0) {
        return next(new Error_1.AppError("No courses found", 404));
    }
    const totalCourses = yield Course_1.default.countDocuments();
    return res.status(200).json({
        status: "success",
        results: courses.length,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCourses / limitNumber),
        courses,
    });
}));
exports.getCourseById = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return next(new Error_1.AppError("ID is required", 400));
    }
    const course = yield Course_1.default.findById(id).select("-__v -createdAt -updatedAt");
    if (!course) {
        return next(new Error_1.AppError("Course not found", 404));
    }
    return res.status(200).json({ status: "success", course });
}));
exports.getCourseByTitleOrDescription = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = req.params;
    const courses = yield Course_1.default.find({
        $or: [
            { title: { $regex: new RegExp(search, "i") } },
            { description: { $regex: new RegExp(search, "i") } }
        ]
    }).select("-__v -createdAt -updatedAt");
    if (!courses.length) {
        return next(new Error_1.AppError("No courses found", 404));
    }
    return res.status(200).json({ status: "success", results: courses.length, courses });
}));
exports.getCoursesByInstructor = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { instructorId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;
    if (!instructorId) {
        return next(new Error_1.AppError("Instructor ID is required", 400));
    }
    const courses = yield Course_1.default.find({ instructor: instructorId })
        .skip(skip)
        .limit(limit).select("-__v -createdAt -updatedAt").populate({
        path: "instructor",
        select: "firstName lastName ",
    });
    if (!courses.length) {
        return next(new Error_1.AppError("No courses found for this instructor", 404));
    }
    return res.status(200).json({ status: "success", results: courses.length, courses });
}));
exports.getCoursesByCategory = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;
    if (!categoryId) {
        return next(new Error_1.AppError("Category ID is required", 400));
    }
    const courses = yield Course_1.default.find({ category: categoryId })
        .skip(skip)
        .limit(limit).select("-__v -createdAt -updatedAt");
    if (!courses.length) {
        return next(new Error_1.AppError("No courses found for this category", 404));
    }
    return res.status(200).json({ status: "success", results: courses.length, courses });
}));
exports.addCourseReview = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { rating, comment } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { courseId } = req.params;
    if (!courseId || !rating || !comment) {
        return next(new Error_1.AppError("Please provide all required fields", 400));
    }
    if (!userId) {
        return next(new Error_1.AppError("User not authenticated", 401));
    }
    if (rating < 1 || rating > 5) {
        return next(new Error_1.AppError("Rating must be between 1 and 5", 400));
    }
    const course = yield Course_1.default.findById(courseId);
    if (!course) {
        return next(new Error_1.AppError("Course not found", 404));
    }
    const review = {
        user: userId,
        rating,
        comment,
    };
    course.reviews.push(review);
    const totalRating = course.reviews.reduce((acc, review) => review.rating + acc, 0);
    course.rating = totalRating / course.reviews.length;
    yield course.save();
    return res.status(200).json({ status: "success", message: "Review added successfully" });
}));
exports.getCourseReviews = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const reviews = yield Course_1.default.findById(courseId).select("reviews").populate({
        path: "reviews.user",
        select: "firstName lastName ",
    }).select("-__v -createdAt -updatedAt");
    if (!reviews) {
        return next(new Error_1.AppError("Course not found", 404));
    }
    return res.status(200).json({ status: "success", results: reviews.reviews.length, reviews });
}));
exports.updateCourse = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    if (!courseId) {
        return next(new Error_1.AppError("Course ID is required", 400));
    }
    const { title, code, description, instructor, price, content, category, isPublished, creditHours, courseType, prerequisites, requirementType } = req.body;
    const updatedCourse = yield Course_1.default.findByIdAndUpdate(courseId, {
        title,
        code,
        description,
        instructor,
        price,
        content,
        category,
        isPublished,
        creditHours,
        courseType,
        prerequisites,
        requirementType,
    }, { new: true });
    if (!updatedCourse) {
        return next(new Error_1.AppError("Course not found", 404));
    }
    return res.status(200).json({ status: "success", updatedCourse });
}));
exports.deleteCourse = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    if (!courseId) {
        return next(new Error_1.AppError("Course ID is required", 400));
    }
    const deletedCourse = yield Course_1.default.findByIdAndDelete(courseId);
    if (!deletedCourse) {
        return next(new Error_1.AppError("Course not found", 404));
    }
    return res.status(200).json({ status: "success", message: "Course deleted successfully" });
}));
