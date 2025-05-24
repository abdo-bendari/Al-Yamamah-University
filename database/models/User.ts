import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  role: "student" | "faculty" | "organization" | "admin";
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  biography: string;
  publications: string;
    conferences: string;
    teaching: string;
    services: string;
workingHours : string;
  timezone: string;
  otpCode?: string;
  otpExpires?: Date;
  profilePic?: string;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    role: {
      type: String,
      enum: ["student", "faculty", "organization", "admin"],
      required: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: {
      type: String,
      unique: true,
      match: [/^\+?\d{10,15}$/, "Invalid phone number format"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    timezone: { type: String, required: true },
    otpCode: { type: String },
    biography: { type: String },
    publications: { type: String },
    conferences: { type: String },
    teaching: { type: String },
    services: { type: String },
    otpExpires: { type: Date },
    workingHours: { type: String },
    profilePic: {
      type: String,
      default: "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg",
    },
  },
  { timestamps: true }
);


UserSchema.pre("save", function (this: any) {
  this.password = bcrypt.hashSync(this.password, 8);
});

UserSchema.methods.comparePassword = function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
