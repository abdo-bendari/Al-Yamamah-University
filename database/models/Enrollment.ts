import mongoose, { Schema, Document } from "mongoose";

export interface IEnrollment extends Document {
  user: mongoose.Types.ObjectId;
  level?: mongoose.Types.ObjectId;
  course?: mongoose.Types.ObjectId;
  payment: mongoose.Types.ObjectId; 
  createdAt: Date;
  
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    level: { type: Schema.Types.ObjectId, ref: "Level" },
    course: { type: Schema.Types.ObjectId, ref: "Course" },
    payment: { type: Schema.Types.ObjectId, ref: "Payment", required: true }, 

  },
  { timestamps: true }
);

export default mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema);
