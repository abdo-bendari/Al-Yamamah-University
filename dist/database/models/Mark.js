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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var MarkStatus;
(function (MarkStatus) {
    MarkStatus["COMPLETED"] = "completed";
    MarkStatus["PENDING"] = "pending";
    MarkStatus["FAILED"] = "failed";
})(MarkStatus || (exports.MarkStatus = MarkStatus = {}));
const calculateGrade = (score, officialScore) => {
    const percentage = (score / officialScore) * 100;
    if (percentage >= 90)
        return "A";
    if (percentage >= 80)
        return "B";
    if (percentage >= 70)
        return "C";
    if (percentage >= 60)
        return "D";
    return "F";
};
const MarkSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true },
    instructor: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    officialScore: { type: Number, required: true },
    score: { type: Number, required: true },
    creditHours: { type: Number, required: true },
    grade: { type: String },
    status: { type: String, enum: Object.values(MarkStatus), default: MarkStatus.PENDING },
}, { timestamps: true });
MarkSchema.pre("save", function (next) {
    this.grade = calculateGrade(this.score, this.officialScore);
    next();
});
exports.default = mongoose_1.default.model("Mark", MarkSchema);
