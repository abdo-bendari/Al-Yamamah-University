"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Error_1 = require("./../utils/Error");
const express_1 = __importDefault(require("express"));
const globalError_1 = __importDefault(require("../middleware/globalError"));
const user_routes_1 = __importDefault(require("./User/user.routes"));
const auth_routes_1 = __importDefault(require("./Auth/auth.routes"));
const course_routes_1 = __importDefault(require("./Course/course.routes"));
const category_routes_1 = __importDefault(require("./Category/category.routes"));
const level_routes_1 = __importDefault(require("./Level/level.routes"));
const enrollment_routes_1 = __importDefault(require("./Enrollment/enrollment.routes"));
const payment_routes_1 = __importDefault(require("./Payment/payment.routes"));
const contact_routes_1 = __importDefault(require("./ContactUs/contact.routes"));
const bootstrap = (app) => {
    process.on("uncaughtException", (err) => {
        console.error("Uncaught Exception:", err);
    });
    app.use(express_1.default.json());
    const baseUrl = "/api/v1";
    // Uncomment these routes once you have the routers ready
    app.use(`${baseUrl}/auth`, auth_routes_1.default);
    app.use(`${baseUrl}/users`, user_routes_1.default);
    app.use(`${baseUrl}/courses`, course_routes_1.default);
    app.use(`${baseUrl}/categories`, category_routes_1.default);
    app.use(`${baseUrl}/levels`, level_routes_1.default);
    app.use(`${baseUrl}/enrollments`, enrollment_routes_1.default);
    app.use(`${baseUrl}/payments`, payment_routes_1.default);
    app.use(`${baseUrl}/contact`, contact_routes_1.default);
    app.use("*", (req, res, next) => {
        next(new Error_1.AppError("Route not found", 404));
    });
    process.on("unhandledRejection", (err) => {
        console.error("Unhandled Rejection:", err);
    });
    app.use(globalError_1.default);
};
exports.default = bootstrap;
