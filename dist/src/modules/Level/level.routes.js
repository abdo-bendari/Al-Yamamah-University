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
const authentication_1 = __importStar(require("../../middleware/authentication"));
const L = __importStar(require("./controller/level.controller"));
const validation_1 = __importDefault(require("../../middleware/validation"));
const level_validation_1 = __importDefault(require("./level.validation"));
const levelRouter = express_1.default.Router();
levelRouter
    .post("/", authentication_1.default, (0, authentication_1.allowedTo)("admin"), (0, validation_1.default)(level_validation_1.default), L.createLevel)
    .get("/", authentication_1.default, L.getAllLevels)
    .get("/:id", authentication_1.default, L.getLevelById)
    .put("/:id", authentication_1.default, (0, authentication_1.allowedTo)("admin"), L.updateLevel)
    .delete("/:id", authentication_1.default, (0, authentication_1.allowedTo)("admin"), L.deleteLevel);
exports.default = levelRouter;
