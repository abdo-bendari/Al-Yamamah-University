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
exports.deleteUser = exports.uploadProfilePicture = exports.updateProfile = exports.getUserById = exports.getUserByName = exports.getOrganizationsCount = exports.getFacultyCount = exports.getStudentsCount = exports.getOrganizations = exports.getFaculty = exports.getStudents = void 0;
const User_1 = __importDefault(require("../../../../database/models/User"));
const Error_1 = require("../../../utils/Error");
const catchError_1 = __importDefault(require("../../../middleware/catchError"));
const getUsersByRole = (role, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1 } = req.query;
    const limit = 10;
    const totalUsers = yield User_1.default.countDocuments({ role });
    const users = yield User_1.default.find({ role })
        .select("firstName lastName role")
        .skip((Number(page) - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });
    return res.status(200).json({
        message: `${role}s found`,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: Number(page),
        users,
    });
});
exports.getStudents = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield getUsersByRole("student", req, res, next);
}));
exports.getFaculty = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield getUsersByRole("faculty", req, res, next);
}));
exports.getOrganizations = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield getUsersByRole("organization", req, res, next);
}));
exports.getStudentsCount = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield User_1.default.countDocuments({ role: "student" });
    res.status(200).json({ role: "students", count });
}));
exports.getFacultyCount = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield User_1.default.countDocuments({ role: "faculty" });
    res.status(200).json({ role: "faculty", count });
}));
exports.getOrganizationsCount = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield User_1.default.countDocuments({ role: "organization" });
    res.status(200).json({ role: "organizations", count });
}));
exports.getUserByName = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    const users = yield User_1.default.find({
        $or: [
            { firstName: { $regex: new RegExp(name, "i") } },
            { lastName: { $regex: new RegExp(name, "i") } }
        ]
    }).select("firstName lastName role");
    if (!users.length)
        return next(new Error_1.AppError("No users found with this name", 404));
    return res.status(200).json({ status: 200, users });
}));
exports.getUserById = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield User_1.default.findById(id).select("firstName lastName role");
    if (!user)
        return next(new Error_1.AppError("User not found", 404));
    return res.status(200).json({ status: 200, user });
}));
exports.updateProfile = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId)
        return next(new Error_1.AppError("User not found", 404));
    const { firstName, lastName, phone, timezone } = req.body;
    const updatedUser = yield User_1.default.findByIdAndUpdate(userId, { firstName, lastName, phone, timezone }, { new: true, runValidators: true, select: "-password -email" });
    if (!updatedUser)
        return next(new Error_1.AppError("User not found", 404));
    return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
}));
exports.uploadProfilePicture = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId)
        return next(new Error_1.AppError("User not found", 404));
    const { profilePicture } = req.body;
    const updatedUser = yield User_1.default.findByIdAndUpdate(userId, { profilePic: profilePicture }, { new: true, runValidators: true, select: "-password -email" });
    if (!updatedUser)
        return next(new Error_1.AppError("User not found", 404));
    return res.status(200).json({ message: "Profile picture updated successfully", user: updatedUser });
}));
exports.deleteUser = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedUser = yield User_1.default.findByIdAndDelete(id);
    if (!deletedUser)
        return next(new Error_1.AppError("User not found", 404));
    return res.status(200).json({ message: "Account deleted successfully" });
}));
