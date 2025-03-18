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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const C = __importStar(require("./controller/course.controller"));
const authentication_1 = __importStar(require("../../middleware/authentication"));
const express_1 = __importDefault(require("express"));
const validation_1 = __importDefault(require("../../middleware/validation"));
const course_validation_1 = __importDefault(require("./course.validation"));
const courseRouter = express_1.default.Router();
courseRouter
    .post("/", authentication_1.default, (0, authentication_1.allowedTo)("admin", "faculty"), (0, validation_1.default)(course_validation_1.default), C.createCourse)
    .get("/", authentication_1.default, C.getAllCourses)
    .get("/:id", authentication_1.default, C.getCourseById)
    .get("/search/:search", authentication_1.default, C.getCourseByTitleOrDescription)
    .get("/instructor/:instructorId", authentication_1.default, C.getCoursesByInstructor)
    .get("/category/:categoryId", authentication_1.default, C.getCoursesByCategory)
    .get("/courseReviews/:courseId", authentication_1.default, C.getCourseReviews)
    .put("/:courseId", authentication_1.default, (0, authentication_1.allowedTo)("admin", "faculty"), C.updateCourse)
    .put("/addReview/:courseId", authentication_1.default, C.addCourseReview)
    .delete("/:courseId", authentication_1.default, (0, authentication_1.allowedTo)("admin"), C.deleteCourse);
// متنساش البجينيشن
//السيرش اللي فوق بكل حاجه 
// ترتيب لليفلات 
// الكاتيجوري 
// السيرش بحرفين حتي
// السيرش بالانستراكتور
// خش علي راوتس اليوزر
// ضيف الماركس 
exports.default = courseRouter;
