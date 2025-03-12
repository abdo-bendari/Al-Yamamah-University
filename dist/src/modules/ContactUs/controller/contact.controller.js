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
exports.deleteContact = exports.updateContactStatus = exports.getContactById = exports.getAllContacts = exports.createContact = void 0;
const Error_1 = require("../../../utils/Error");
const catchError_1 = __importDefault(require("../../../middleware/catchError"));
const Contact_1 = __importDefault(require("../../../../database/models/Contact"));
exports.createContact = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return next(new Error_1.AppError("Please provide all required fields", 400));
    }
    const contact = yield Contact_1.default.create({ name, email, message });
    return res.status(201).json({
        message: "Message sent successfully",
        contact,
    });
}));
exports.getAllContacts = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const contacts = yield Contact_1.default.find().sort({ createdAt: -1 }).select("-__v");
    res.status(200).json({
        message: "All messages retrieved successfully",
        total: contacts.length,
        contacts,
    });
}));
exports.getContactById = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const contact = yield Contact_1.default.findById(id).select("-__v");
    if (!contact) {
        return next(new Error_1.AppError("Message not found", 404));
    }
    return res.status(200).json({
        message: "Message retrieved successfully",
        contact,
    });
}));
exports.updateContactStatus = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || !["unread", "read"].includes(status)) {
        return next(new Error_1.AppError("Invalid status", 400));
    }
    const contact = yield Contact_1.default.findByIdAndUpdate(id, { status }, { new: true });
    if (!contact) {
        return next(new Error_1.AppError("Message not found", 404));
    }
    return res.status(200).json({
        message: "Message status updated successfully",
        contact,
    });
}));
exports.deleteContact = (0, catchError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const contact = yield Contact_1.default.findByIdAndDelete(id);
    if (!contact) {
        return next(new Error_1.AppError("Message not found", 404));
    }
    return res.status(200).json({
        message: "Message deleted successfully",
    });
}));
