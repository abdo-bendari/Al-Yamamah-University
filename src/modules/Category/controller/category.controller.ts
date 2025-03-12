import { AppError } from './../../../utils/Error';
import catchError from "../../../middleware/catchError";
import Category from '../../../../database/models/Category';
import Course from '../../../../database/models/Course';
import { Request, Response, NextFunction } from 'express';


export const createCategory = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { name, description,courses } = req.body;
  
    if (!name) {
      return next(new AppError("Category name is required", 400));
    }
  
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return next(new AppError("Category already exists", 400));
    }
  
    const category = await Category.create({ name, description , courses });
  
    return res.status(201).json({ status: "success", category });
  });

  export const getAllCategories = catchError(async (req: Request, res: Response) => {
    const categories = await Category.find().select("-__v -createdAt -updatedAt").populate({
      path: "courses",
      select: "title code instructor", 
      populate: { path: "instructor", select: "firstName lastName" } 
    });
  
    return res.status(200).json({ status: "success", results: categories.length, categories });
  });
  
  export const getCategoryById = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
  
    const category = await Category.findById(id).select("-__v -createdAt -updatedAt").populate({
      path: "courses",
      select: "title code instructor",
      populate: { path: "instructor", select: "firstName lastName" }
    });
  
    if (!category) {
      return next(new AppError("Category not found", 404));
    }
  
    return res.status(200).json({ status: "success", category });
  });

  export const updateCategory = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, description } = req.body;
  
    const category = await Category.findByIdAndUpdate(id, { name, description }, { new: true });
  
    if (!category) {
      return next(new AppError("Category not found", 404));
    }
  
    return res.status(200).json({ status: "success", category });
  });

  
  export const deleteCategory = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
  
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return next(new AppError("Category not found", 404));
    }
  
    return res.status(200).json({ status: "success", message: "Category deleted successfully" });
  });
  
  export const addCourseToCategory = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;
    const { courseId } = req.body;
  
    const category = await Category.findById(categoryId);
    if (!category) {
      return next(new AppError("Category not found", 404));
    }
  
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new AppError("Course not found", 404));   
    }
  
    category.courses.push(courseId);
    await category.save();
  
    return res.status(200).json({ status: "success", message: "Course added to category successfully" });
  });
  
  export const removeCourseFromCategory = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;
    const { courseId } = req.body;
  
    const category = await Category.findById(categoryId);
    if (!category) {
      return next(new AppError("Category not found", 404));
    }
  
    const index = category.courses.indexOf(courseId);
    if (index !== -1) {
      category.courses.splice(index, 1);
      await category.save();
  
      return res.status(200).json({ status: "success", message: "Course removed from category successfully" });
    } else {
      return next(new AppError("Course not found in category", 404));
    }
  });