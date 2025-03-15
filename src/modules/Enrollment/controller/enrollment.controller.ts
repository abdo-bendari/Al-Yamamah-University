import catchError from "../../../middleware/catchError";
import { AppError } from "../../../utils/Error";
import { NextFunction, Request, Response } from "express";
import Enrollment from "../../../../database/models/Enrollment";
import Payment, { PaymentStatus } from "../../../../database/models/Payment";
import Course from "../../../../database/models/Course";



export const enrollUser = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { userId, levelId, courseId, paymentId } = req.body;
  if (!courseId && !levelId) {
    return next(new AppError("Either courseId or levelId must be provided", 400));
  }
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    return next(new AppError("Payment record not found", 404));
  }

  if (payment.status !== PaymentStatus.SUCCESS) {
    return next(new AppError("Payment is not completed", 400));
  }

  const enrollment = await Enrollment.create({
    user: userId,
    level: levelId || null,
    course: courseId || null,
    payment: paymentId,
  });
  if (courseId) {
    await Course.findByIdAndUpdate(courseId, { $inc: { studentsEnrolled: 1 } }, { new: true });
  }
  return res.status(201).json({ status: "success", enrollment });
});

export const getUserEnrollments = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
  
    const enrollments = await Enrollment.find({ user: userId })
      .populate("level", "name order") 
      .populate("course", "title code") 
      .populate("payment", "amount status");
  
    res.status(200).json({ status: "success", results: enrollments.length, enrollments });
  });

export const getEnrollment = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { enrollmentId } = req.params;
  
    const enrollment = await Enrollment.findById(enrollmentId)
      .populate("level", "name order") 
      .populate("course", "title code") 
      .populate("payment", "amount status");
  
    if (!enrollment) {
      return next(new AppError("Enrollment not found", 404));
    }
  
    res.status(200).json({ status: "success", enrollment });
  });
  
export const updateEnrollment = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { enrollmentId } = req.params;
  const { levelId, courseId } = req.body;

  if (!courseId && !levelId) {
    return next(new AppError("Either courseId or levelId must be provided", 400));
  }
  const updatedEnrollment = await Enrollment.findByIdAndUpdate(
    enrollmentId,
    { level: levelId || null, course: courseId || null },
    { new: true, runValidators: true }
  );
  if (!updatedEnrollment) {
    return next(new AppError("Enrollment not found", 404));
  }
  return res.status(200).json({ status: "success", updatedEnrollment });
});

export const deleteEnrollment = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { enrollmentId } = req.params;

  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) {
    return next(new AppError("Enrollment not found", 404));
  }
  await Enrollment.findByIdAndDelete(enrollmentId);
  if (enrollment.course) {
    await Course.findByIdAndUpdate(enrollment.course, { $inc: { studentsEnrolled: -1 } });
  }
  return res.status(204).json({ status: "success", message: "Enrollment deleted successfully" });
});