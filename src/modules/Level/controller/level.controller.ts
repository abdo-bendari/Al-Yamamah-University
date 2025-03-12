import Level from "../../../../database/models/Level";
import catchError from "../../../middleware/catchError";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../utils/Error";

export const createLevel = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { name, courses, order, isPublished, prerequisiteCoursesCount } = req.body;
    if (!name || !courses || !order || !prerequisiteCoursesCount) {
      return next(new AppError("Please provide all required fields", 400));
    }
      const existingLevel = await Level.findOne({ name });
            if (existingLevel) {
              return next(new AppError("Level already exists", 400));
            } 
    const newLevel = await Level.create({ name, courses, order, isPublished, prerequisiteCoursesCount });
    return res.status(201).json({
      status: "success",
      message: "Level created successfully",
      level: newLevel,
    });
  });
  
  export const getAllLevels = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const levels = await Level.find()
      .sort({ order: 1 }) 
      .select("name order prerequisiteCoursesCount"); 
  
    return res.status(200).json({
      status: "success",
      results: levels.length,
      levels,
    });
  });

  export const getLevelById = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
  
    const level = await Level.findById(id)
      .populate({
        path: "courses",
        select: "code title courseType prerequisites creditHours requirementType", 
        populate: { path: "prerequisites", select: "code title" }, 
      })
      .select("-__v -createdAt -updatedAt"); 
  
    if (!level) {
      return next(new AppError("Level not found", 404));
    }
  
    return res.status(200).json({ status: "success", level });
  });
  
  
  export const updateLevel = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updatedData = req.body;
  
    const updatedLevel = await Level.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
  
    if (!updatedLevel) {
      return next(new AppError("Level not found", 404));
    }
  
    return res.status(200).json({ status: "success", message: "Level updated successfully", level: updatedLevel });
  });
  

  export const deleteLevel = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
  
    const deletedLevel = await Level.findByIdAndDelete(id);
  
    if (!deletedLevel) {
      return next(new AppError("Level not found", 404));
    }
  
    return res.status(200).json({ status: "success", message: "Level deleted successfully" });
  });
  
  