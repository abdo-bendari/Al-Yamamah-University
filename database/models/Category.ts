import mongoose, { Schema, Document } from "mongoose";

interface ICategory extends Document {
  name: string;
  description?: string;
  courses: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }], 
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>("Category", CategorySchema);
