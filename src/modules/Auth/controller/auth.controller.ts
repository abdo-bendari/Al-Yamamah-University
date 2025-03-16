import { AppError } from "./../../../utils/Error";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import catchError from "../../../middleware/catchError";
import User from "../../../../database/models/User";
import dotenv from "dotenv";
import crypto from "crypto";
import sendEmail from "../../../utils/sendEmail";
dotenv.config();

export const signUp = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { role, firstName, lastName, phone, email, password, timezone } = req.body;
   if (!role || !firstName || !lastName || !email || !password || !timezone){
      return next(new AppError("Please provide all required fields", 400));

   }

    let user = new User({
      role,
      firstName,
      lastName,
      phone,
      email,
      password,
      timezone,
    });
    await user.save();
    const token = jwt.sign( { userId: user._id, role: user.role },process.env.JWT_KEY as string);
    return res.status(200).json({ message: "Signup successful", token, status: 200 });
  }
);

export const signIn = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password)
      return next(new AppError("Please provide email and password", 400));
    const user = await User.findOne({ email: email });
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY as string );
    return res.status(200).json({ message: "Login successful", token, status: 200 });}
    return next(new AppError("Invalid email or password", 401));
  }
);

export const forgetPassword = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { identifier } = req.body; 
  if (!identifier) return next(new AppError("Please provide your email", 400));

  const user = await User.findOne({ email: identifier });
  if (!user) return next(new AppError("User not found", 404));

  const otpCode = crypto.randomInt(1000, 9999).toString();
  user.otpCode = otpCode;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 minutes
  await user.save();

    await sendEmail({
    to: user.email,
    subject: "Password Reset Code",
    text: `Your OTP code is: ${otpCode}`,
})
  res.status(200).json({ message: "OTP has been sent to your email", status: 200 });
});

export const resetPassword = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { email, otpCode, newPassword } = req.body;
  if (!email || !otpCode || !newPassword) return next(new AppError("Please provide all required fields", 400));

  const user = await User.findOne({ email });
  if (!user || user.otpCode !== otpCode || new Date() > user.otpExpires!) {
      return next(new AppError("Invalid or expired OTP", 400));
  }

  user.password = newPassword;
  user.otpCode = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.status(200).json({ message: "Password reset successful", status: 200 });
});

export const resendOtp = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  if (!email) return next(new AppError("Please provide your email", 400));

  const user = await User.findOne({ email });
  if (!user) return next(new AppError("User not found", 404));

  let otpCode = user.otpCode;
  let otpExpires = user.otpExpires;

  if (!otpCode || !otpExpires || otpExpires < new Date()) {
      otpCode = crypto.randomInt(1000, 9999).toString(); 
      otpExpires = new Date(Date.now() + 10 * 60 * 1000); 
      user.otpCode = otpCode;
      user.otpExpires = otpExpires;
      await user.save();
  }

  await sendEmail({
      to: user.email,
      subject: "Resend OTP Code",
      text: `Your OTP code is: ${otpCode}`,
  });

  res.status(200).json({ message: "OTP resent to your email", status: 200 });
});