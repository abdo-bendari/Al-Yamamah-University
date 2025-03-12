import mongoose, { Schema, Document } from "mongoose";

export enum ContactStatus {
  UNREAD = "unread",
  READ = "read",
}

interface IContact extends Document {
  name: string;
  email: string;
  message: string;
  status: ContactStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(ContactStatus),
      default: ContactStatus.UNREAD,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IContact>("Contact", ContactSchema);
