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
exports.deleteMark = exports.getMarksForCourse = exports.getMarksForStudent = exports.updateMark = exports.addMark = void 0;
const Mark_1 = __importDefault(require("../../../../database/models/Mark"));
const catchError_1 = __importDefault(require("../../../middleware/catchError"));
const Error_1 = require("../../../utils/Error");
const Course_1 = __importDefault(require("../../../../database/models/Course"));
const User_1 = __importDefault(require("../../../../database/models/User"));
const Mark_2 = require("../../../../database/models/Mark");
exports.addMark = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { userId, courseId, score, officialScore } = req.body;
    const instructorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const student = yield User_1.default.findById(userId);
    if (!student)
        return next(new Error_1.AppError("Student not found", 404));
    const instructor = yield User_1.default.findById(instructorId);
    if (!instructor)
        return next(new Error_1.AppError("Instructor not found", 404));
    const course = yield Course_1.default.findById(courseId);
    if (!course)
        return next(new Error_1.AppError("Course not found", 404));
    if (userId === instructorId) {
        return next(new Error_1.AppError("Instructor cannot grade themselves", 400));
    }
    const mark = yield Mark_1.default.create({
        user: userId,
        course: courseId,
        instructor: instructorId,
        officialScore,
        creditHours: course.creditHours,
        score,
        status: Mark_2.MarkStatus.COMPLETED,
    });
    return res.status(201).json({ status: "success", mark });
}));
exports.updateMark = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { markId } = req.params;
    const { score, status } = req.body;
    const mark = yield Mark_1.default.findById(markId);
    if (!mark)
        return next(new Error_1.AppError("Mark not found", 404));
    mark.score = score !== null && score !== void 0 ? score : mark.score;
    mark.status = status !== null && status !== void 0 ? status : mark.status;
    yield mark.save();
    return res.status(200).json({ status: "success", mark });
}));
exports.getMarksForStudent = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const student = yield User_1.default.findById(userId);
    if (!student)
        return next(new Error_1.AppError("Student not found", 404));
    const marks = yield Mark_1.default.find({ user: userId })
        .populate("course", "title code creditHours")
        .populate("instructor", "firstName lastName");
    return res.status(200).json({ status: "success", results: marks.length, marks });
}));
// 🔹 جلب الدرجات الخاصة بكورس معين
exports.getMarksForCourse = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const course = yield Course_1.default.findById(courseId);
    if (!course)
        return next(new Error_1.AppError("Course not found", 404));
    const marks = yield Mark_1.default.find({ course: courseId })
        .populate("user", "firstName lastName")
        .populate("instructor", "firstName lastName");
    return res.status(200).json({ status: "success", results: marks.length, marks });
}));
// 🔹 حذف درجة معينة
exports.deleteMark = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { markId } = req.params;
    const mark = yield Mark_1.default.findByIdAndDelete(markId);
    if (!mark)
        return next(new Error_1.AppError("Mark not found", 404));
    return res.status(200).json({ status: "success", message: "Mark deleted successfully" });
}));
