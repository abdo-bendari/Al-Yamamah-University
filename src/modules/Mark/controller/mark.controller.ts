import Mark from "../../../../database/models/Mark";
import catchError from "../../../middleware/catchError";
import { AppError } from "../../../utils/Error";
import { Request, Response , NextFunction } from "express";
import Course from "../../../../database/models/Course";
import User from "../../../../database/models/User";
import { MarkStatus } from "../../../../database/models/Mark";



export const addMark = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { userId, courseId, score ,officialScore} = req.body;
  const instructorId = req.user?.userId;

  const student = await User.findById(userId);
  if (!student) return next(new AppError("Student not found", 404));

  const instructor = await User.findById(instructorId);
  if (!instructor) return next(new AppError("Instructor not found", 404));

  const course = await Course.findById(courseId);
  if (!course) return next(new AppError("Course not found", 404));

  if (userId === instructorId) {
    return next(new AppError("Instructor cannot grade themselves", 400));
  }

  const mark = await Mark.create({
    user: userId,
    course: courseId,
    instructor: instructorId,
    officialScore,
    creditHours: course.creditHours,
    score,
    status: MarkStatus.COMPLETED,
  });

  return res.status(201).json({ status: "success", mark });
});

export const updateMark = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { markId } = req.params;
  const { score, status } = req.body;

  const mark = await Mark.findById(markId);
  if (!mark) return next(new AppError("Mark not found", 404));
  mark.score = score ?? mark.score;
  mark.status = status ?? mark.status;
  await mark.save();

  return res.status(200).json({ status: "success", mark });
});

export const getMarksForStudent = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  const student = await User.findById(userId);
  if (!student) return next(new AppError("Student not found", 404));

  const marks = await Mark.find({ user: userId })
    .populate("course", "title code creditHours")
    .populate("instructor", "firstName lastName");

  return res.status(200).json({ status: "success", results: marks.length, marks });
});

// 🔹 جلب الدرجات الخاصة بكورس معين
export const getMarksForCourse = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) return next(new AppError("Course not found", 404));

  const marks = await Mark.find({ course: courseId })
    .populate("user", "firstName lastName")
    .populate("instructor", "firstName lastName");

  return res.status(200).json({ status: "success", results: marks.length, marks });
});

// 🔹 حذف درجة معينة
export const deleteMark = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { markId } = req.params;

  const mark = await Mark.findByIdAndDelete(markId);
  if (!mark) return next(new AppError("Mark not found", 404));

  return res.status(200).json({ status: "success", message: "Mark deleted successfully" });
});
