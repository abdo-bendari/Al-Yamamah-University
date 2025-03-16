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
exports.deleteEnrollment = exports.updateEnrollment = exports.getEnrollment = exports.getUserEnrollments = exports.enrollUser = void 0;
const catchError_1 = __importDefault(require("../../../middleware/catchError"));
const Error_1 = require("../../../utils/Error");
const Enrollment_1 = __importDefault(require("../../../../database/models/Enrollment"));
const Payment_1 = __importStar(require("../../../../database/models/Payment"));
const Course_1 = __importDefault(require("../../../../database/models/Course"));
exports.enrollUser = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, levelId, courseId, paymentId } = req.body;
    if (!courseId && !levelId) {
        return next(new Error_1.AppError("Either courseId or levelId must be provided", 400));
    }
    const payment = yield Payment_1.default.findById(paymentId);
    if (!payment) {
        return next(new Error_1.AppError("Payment record not found", 404));
    }
    if (payment.status !== Payment_1.PaymentStatus.SUCCESS) {
        return next(new Error_1.AppError("Payment is not completed", 400));
    }
    const enrollment = yield Enrollment_1.default.create({
        user: userId,
        level: levelId || null,
        course: courseId || null,
        payment: paymentId,
    });
    if (courseId) {
        yield Course_1.default.findByIdAndUpdate(courseId, { $inc: { studentsEnrolled: 1 } }, { new: true });
    }
    return res.status(201).json({ status: "success", enrollment });
}));
exports.getUserEnrollments = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const enrollments = yield Enrollment_1.default.find({ user: userId })
        .populate("level", "name order")
        .populate("course", "title code")
        .populate("payment", "amount status");
    res.status(200).json({ status: "success", results: enrollments.length, enrollments });
}));
exports.getEnrollment = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { enrollmentId } = req.params;
    const enrollment = yield Enrollment_1.default.findById(enrollmentId)
        .populate("level", "name order")
        .populate("course", "title code")
        .populate("payment", "amount status");
    if (!enrollment) {
        return next(new Error_1.AppError("Enrollment not found", 404));
    }
    res.status(200).json({ status: "success", enrollment });
}));
exports.updateEnrollment = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { enrollmentId } = req.params;
    const { levelId, courseId } = req.body;
    if (!courseId && !levelId) {
        return next(new Error_1.AppError("Either courseId or levelId must be provided", 400));
    }
    const updatedEnrollment = yield Enrollment_1.default.findByIdAndUpdate(enrollmentId, { level: levelId || null, course: courseId || null }, { new: true, runValidators: true });
    if (!updatedEnrollment) {
        return next(new Error_1.AppError("Enrollment not found", 404));
    }
    return res.status(200).json({ status: "success", updatedEnrollment });
}));
exports.deleteEnrollment = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { enrollmentId } = req.params;
    const enrollment = yield Enrollment_1.default.findById(enrollmentId);
    if (!enrollment) {
        return next(new Error_1.AppError("Enrollment not found", 404));
    }
    yield Enrollment_1.default.findByIdAndDelete(enrollmentId);
    if (enrollment.course) {
        yield Course_1.default.findByIdAndUpdate(enrollment.course, { $inc: { studentsEnrolled: -1 } });
    }
    return res.status(204).json({ status: "success", message: "Enrollment deleted successfully" });
}));
