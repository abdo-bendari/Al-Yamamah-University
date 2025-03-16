import mongoose, { Schema, Document } from "mongoose";

export enum MarkStatus {
  COMPLETED = "completed",
  PENDING = "pending",
  FAILED = "failed",
}

interface IMark extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  instructor: mongoose.Types.ObjectId;
  officialScore: number; 
  score: number; 
  creditHours: number; 
  grade: string; 
  status: MarkStatus;
  createdAt: Date;
  updatedAt: Date;
}

const calculateGrade = (score: number, officialScore: number): string => {
  const percentage = (score / officialScore) * 100;
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D";
  return "F";
};

const MarkSchema = new Schema<IMark>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    instructor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    officialScore: { type: Number, required: true }, 
    score: { type: Number, required: true }, 
    creditHours: { type: Number, required: true }, 
    grade: { type: String },
    status: { type: String, enum: Object.values(MarkStatus), default: MarkStatus.PENDING },
  },
  { timestamps: true }
);


MarkSchema.pre("save", function (next) {
  this.grade = calculateGrade(this.score, this.officialScore);
  next();
});

export default mongoose.model<IMark>("Mark", MarkSchema);
