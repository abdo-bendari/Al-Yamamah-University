import catchError from "../../../middleware/catchError";
import { AppError } from "../../../utils/Error";
import { NextFunction, Request, Response } from "express";
import Enrollment from "../../../../database/models/Enrollment";
import Payment, { PaymentStatus } from "../../../../database/models/Payment";
import Course from "../../../../database/models/Course";



export const enrollUser = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { userId, levelId, courseId, paymentId } = req.body;

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
  Course.findByIdAndUpdate(courseId, { $inc: { studentsEnrolled: 1 } }, { new: true }).exec();

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

