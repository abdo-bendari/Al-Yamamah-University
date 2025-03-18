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
exports.resendOtp = exports.resetPassword = exports.forgetPassword = exports.signIn = exports.signUp = void 0;
const Error_1 = require("./../../../utils/Error");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const catchError_1 = __importDefault(require("../../../middleware/catchError"));
const User_1 = __importDefault(require("../../../../database/models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = __importDefault(require("crypto"));
const sendEmail_1 = __importDefault(require("../../../utils/sendEmail"));
dotenv_1.default.config();
exports.signUp = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, firstName, lastName, phone, email, password, timezone } = req.body;
    if (!role || !firstName || !lastName || !email || !password || !timezone) {
        return next(new Error_1.AppError("Please provide all required fields", 400));
    }
    let user = new User_1.default({
        role,
        firstName,
        lastName,
        phone,
        email,
        password,
        timezone,
    });
    yield user.save();
    const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY);
    return res.status(200).json({ message: "Signup successful", token, status: 200 });
}));
exports.signIn = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password)
        return next(new Error_1.AppError("Please provide email and password", 400));
    const user = yield User_1.default.findOne({ email: email });
    if (user && bcrypt_1.default.compareSync(password, user.password)) {
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY);
        return res.status(200).json({ message: "Login successful", token, status: 200 });
    }
    return next(new Error_1.AppError("Invalid email or password", 401));
}));
exports.forgetPassword = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { identifier } = req.body;
    if (!identifier)
        return next(new Error_1.AppError("Please provide your email", 400));
    const user = yield User_1.default.findOne({ email: identifier });
    if (!user)
        return next(new Error_1.AppError("User not found", 404));
    const otpCode = crypto_1.default.randomInt(1000, 9999).toString();
    user.otpCode = otpCode;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 minutes
    yield user.save();
    yield (0, sendEmail_1.default)({
        to: user.email,
        subject: "Password Reset Code",
        text: `Your OTP code is: ${otpCode}`,
    });
    res.status(200).json({ message: "OTP has been sent to your email", status: 200 });
}));
exports.resetPassword = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otpCode, newPassword } = req.body;
    if (!email || !otpCode || !newPassword)
        return next(new Error_1.AppError("Please provide all required fields", 400));
    const user = yield User_1.default.findOne({ email });
    if (!user || user.otpCode !== otpCode || new Date() > user.otpExpires) {
        return next(new Error_1.AppError("Invalid or expired OTP", 400));
    }
    user.password = newPassword;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    yield user.save();
    res.status(200).json({ message: "Password reset successful", status: 200 });
}));
exports.resendOtp = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email)
        return next(new Error_1.AppError("Please provide your email", 400));
    const user = yield User_1.default.findOne({ email });
    if (!user)
        return next(new Error_1.AppError("User not found", 404));
    let otpCode = user.otpCode;
    let otpExpires = user.otpExpires;
    if (!otpCode || !otpExpires || otpExpires < new Date()) {
        otpCode = crypto_1.default.randomInt(1000, 9999).toString();
        otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        user.otpCode = otpCode;
        user.otpExpires = otpExpires;
        yield user.save();
    }
    yield (0, sendEmail_1.default)({
        to: user.email,
        subject: "Resend OTP Code",
        text: `Your OTP code is: ${otpCode}`,
    });
    res.status(200).json({ message: "OTP resent to your email", status: 200 });
}));
