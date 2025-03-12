import catchError from "../../../middleware/catchError";
import { AppError } from "../../../utils/Error";
import { NextFunction, Request, Response } from "express";
import Course from "../../../../database/models/Course";


export const createCourse = catchError(async (req: Request, res: Response,next : NextFunction) => {
    const {
      title,
      code,
      description,
      instructor,
      price,
      content,
      category,
      isPublished,
      creditHours,
      courseType,
      prerequisites,
      requirementType,
    } = req.body;
    if (!title || !code || !description || !instructor || !price || !content || !category || !isPublished || !creditHours || !courseType || !requirementType) {
        return next(new AppError("Please provide all required fields", 400));
    }
      const existingCourse = await Course.findOne({ title });
        if (existingCourse) {
          return next(new AppError("Course already exists", 400));
        }
    const newCourse = await Course.create({
      title,
      code,
      description,
      instructor,
      price,
      content,
      category,
      isPublished,
      creditHours,
      courseType,
      prerequisites,
      requirementType,
    });
    return res.status(201).json({ message: "Course created successfully", newCourse });
  });


export const getAllCourses = catchError(async (req: Request, res: Response ,next : NextFunction) => {
  let { page, limit } = req.query;
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 6;
  const skip = (pageNumber - 1) * limitNumber;

  const courses = await Course.find().skip(skip).limit(limitNumber).select("-__v -createdAt -updatedAt");
  if (courses.length === 0) {
    return next(new AppError("No courses found", 404));
  }
  const totalCourses = await Course.countDocuments();
  return res.status(200).json({
    status: "success",
    results: courses.length,
    currentPage: pageNumber,
    totalPages: Math.ceil(totalCourses / limitNumber),
    courses,
  });
});

export const getCourseById = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(new AppError("ID is required", 400));
    }
    const course = await Course.findById(id).select("-__v -createdAt -updatedAt");
    if (!course) {
      return next(new AppError("Course not found", 404));
    }
    return res.status(200).json({ status: "success", course });
  });
export const getCourseByTitleOrDescription = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const {search} = req.params;


  const courses = await Course.find({
    $or: [
      { title: { $regex: new RegExp(search, "i") } }, 
      { description: { $regex: new RegExp(search, "i") } }
    ]
  }).select("-__v -createdAt -updatedAt");

  if (!courses.length) {
    return next(new AppError("No courses found", 404));
  }
  return res.status(200).json({ status: "success",results: courses.length, courses });
});

export const getCoursesByInstructor = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { instructorId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    if (!instructorId) {
      return next(new AppError("Instructor ID is required", 400));
    }

    const courses = await Course.find({ instructor: instructorId })
      .skip(skip)
      .limit(limit).select("-__v -createdAt -updatedAt").populate({
        path: "instructor",
        select: "firstName lastName ", 
      });

    if (!courses.length) {
      return next(new AppError("No courses found for this instructor", 404));
    }

    return res.status(200).json({ status: "success", results: courses.length, courses });
  }
);

export const getCoursesByCategory = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit
    if (!categoryId) {
      return next(new AppError("Category ID is required", 400));
    }

    const courses = await Course.find({ category: categoryId })
      .skip(skip)
      .limit(limit).select("-__v -createdAt -updatedAt")

    if (!courses.length) {
      return next(new AppError("No courses found for this category", 404));
    }

    return res.status(200).json({ status: "success", results: courses.length, courses });
  }
);

export const updateCourse = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { courseId } = req.params;
    if (!courseId) {
      return next(new AppError("Course ID is required", 400));
    }
    const { title, code, description, instructor, price, content, category, isPublished, creditHours, courseType, prerequisites, requirementType } = req.body;
    const updatedCourse = await Course.findByIdAndUpdate(courseId, {
      title,
      code,
      description,
      instructor,
      price,
      content,
      category,
      isPublished,
      creditHours,
      courseType,
      prerequisites,
      requirementType,
    }, { new: true });
    if (!updatedCourse) {
      return next(new AppError("Course not found", 404));
    }
    return res.status(200).json({ status: "success", updatedCourse });
  }
);

export const deleteCourse = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { courseId } = req.params;
    if (!courseId) {
      return next(new AppError("Course ID is required", 400));
    }
    const deletedCourse = await Course.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      return next(new AppError("Course not found", 404));
    }
    return res.status(200).json({ status: "success", message: "Course deleted successfully" });
  }
);