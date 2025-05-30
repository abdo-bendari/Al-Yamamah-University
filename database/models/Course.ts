import mongoose, { Schema, Document } from "mongoose";

interface ICourse extends Document {
  title: string;
  code: string;
  description: string;
  instructor: mongoose.Types.ObjectId;
  level :mongoose.Types.ObjectId;
  price?: number;
  studentsEnrolled: number;
  reviews: { comment: string; rating: number; user: mongoose.Types.ObjectId }[];
  rating: number;
  content: {
    moduleTitle: string;
    videos: { title: string; videoUrl: string; materials?: string[] }[];
  }[];
  category: mongoose.Types.ObjectId;
  program: mongoose.Types.ObjectId;
  courseOutcome: string;
  isPublished: boolean;
  isPaid: boolean;
  creditHours: number;
  courseType: "required" | "elective";
  prerequisites?: mongoose.Types.ObjectId[];
  requirementType?: "college" | "institution";
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    instructor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    price: { type: Number, default: 0.0 },
    studentsEnrolled: { type: Number, default: 0 },
    content: [
      {
        moduleTitle: { type: String, required: true },
        videos: [
          {
            title: { type: String, required: true },
            videoUrl: { type: String, required: true },
            materials: [{ type: String }],
          },
        ],
      },
    ],
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    level: { type: Schema.Types.ObjectId, ref: "Level", required: true },
    program: { type: Schema.Types.ObjectId, ref: "Program", required: true },
    reviews: {
      type: [
        {
          comment: { type: String, required: true },
          rating: { type: Number, required: true },
          user: { type: Schema.Types.ObjectId, ref: "User" },
        },
      ],
      default: [],
    },
    rating: { type: Number, default: 0 },
    courseOutcome: { type: String, required: true },
    isPublished: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false },
    creditHours: { type: Number, required: true },
    courseType: {
      type: String,
      enum: ["required", "elective"],
      required: true,
    },
    prerequisites: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    requirementType: { type: String, enum: ["college", "institution"] },
    imageUrl: { type: String },
  },
  { timestamps: true }
);


export default mongoose.model<ICourse>("Course", CourseSchema);
