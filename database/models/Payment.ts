import mongoose, { Schema, Document } from "mongoose";

export enum PaymentStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
}

interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  level?: mongoose.Types.ObjectId;
  course?: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripeSessionId: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    level: { type: Schema.Types.ObjectId, ref: "Level", default: null },
    course: { type: Schema.Types.ObjectId, ref: "Course", default: null },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "usd" },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    stripeSessionId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>("Payment", PaymentSchema);
