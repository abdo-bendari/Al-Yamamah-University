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
const express_1 = __importDefault(require("express"));
const CT = __importStar(require("./controller/category.controller"));
const authentication_1 = __importStar(require("../../middleware/authentication"));
const validation_1 = __importDefault(require("../../middleware/validation"));
const category_validation_1 = __importDefault(require("./category.validation"));
const categoryRouter = express_1.default.Router();
categoryRouter
    .post("/", authentication_1.default, (0, authentication_1.allowedTo)("admin"), (0, validation_1.default)(category_validation_1.default), CT.createCategory)
    .get("/", authentication_1.default, CT.getAllCategories)
    .get("/:id", authentication_1.default, CT.getCategoryById)
    .put("/:id", authentication_1.default, (0, authentication_1.allowedTo)("admin"), CT.updateCategory)
    .delete("/:id", authentication_1.default, (0, authentication_1.allowedTo)("admin"), CT.deleteCategory)
    .put("/:categoryId/addCourse", authentication_1.default, (0, authentication_1.allowedTo)("admin"), CT.addCourseToCategory)
    .put("/:categoryId/removeCourse", authentication_1.default, (0, authentication_1.allowedTo)("admin"), CT.removeCourseFromCategory);
exports.default = categoryRouter;
