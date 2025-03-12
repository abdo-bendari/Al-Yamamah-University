import mongoose, { Schema, Document } from "mongoose";

interface ILevel extends Document {
  name: string;
  courses: mongoose.Types.ObjectId[];
  order: number;
  isPublished: boolean;
  prerequisiteCoursesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const LevelSchema = new Schema<ILevel>(
  {
    name: { type: String, required: true, trim: true },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    order: { type: Number, required: true, unique: true },
    isPublished: { type: Boolean, default: false },
    prerequisiteCoursesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ILevel>("Level", LevelSchema);
