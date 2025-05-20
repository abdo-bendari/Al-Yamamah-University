import Program from "../../../../database/models/Program";
import catchError from "../../../middleware/catchError";
import { AppError } from "../../../utils/Error";
import { NextFunction, Request, Response } from "express";


export const createProgram = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const {
    title,
    programCode,
    qualificationLevel,
    department,
    college,
    institution,
    lastReviewDate,
    programSpecification,
    programsMainLocation,
    majorTracks,
    exitPoints,
    totalCreditHours,
    programMission,
    programGoals,
    programLearningOutcomes,
    courses,
    levels,
  } = req.body;

  if (!title || !programCode || !qualificationLevel || !department || !college || !institution || !lastReviewDate || !programSpecification || !programsMainLocation || !majorTracks || !exitPoints || !totalCreditHours || !programMission || !programGoals || !programLearningOutcomes || !courses || !levels) {   
    return next(new AppError("Please provide all required fields", 400));
  }
  const newProgram = await Program.create({
    title,
    programCode,
    qualificationLevel,
    department,
    college,
    institution,
    lastReviewDate,
    programSpecification,
    programsMainLocation,
    majorTracks,
    exitPoints,
    totalCreditHours,
    programMission,
    programGoals,
    programLearningOutcomes,
    courses,
    levels,
  });

 return res.status(201).json({ status: "success", program: newProgram });
});

export const getAllPrograms = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const programs = await Program.find({}, "title programCode");

    res.status(200).json({
      status: "success",
      results: programs.length,
      programs,
    });
  }
);

export const getProgramInfo = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const program = await Program.findById(id).select(
      "-courses -levels"
    );

    if (!program) {
      return next(new AppError("Program not found", 404));
    }

    res.status(200).json({
      status: "success",
      program,
    });
  }
);


export const getProgramWithLevels = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const program = await Program.findById(id)
      .populate({
        path: "levels",
        select: "-__v -createdAt -updatedAt",
        populate: {
          path: "courses",
          select: "code title courseType prerequisites creditHours requirementType",
          populate: {
            path: "prerequisites",
            select: "code title",
          },
        },
      })
      .select("-__v -createdAt -updatedAt");

    if (!program) {
      return next(new AppError("Program not found", 404));
    }

    return res.status(200).json({
      status: "success",
      program,
    });
  }
);

export const getProgramLevels = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const program = await Program.findById(id).populate({
    path: "levels",
    select: "name order",
    options: { sort: { order: 1 } },    
  });

  if (!program) return next(new AppError("Program not found", 404));

  return res.status(200).json({
    status: "success",
    results: program.levels.length,
    levels: program.levels,
  });
});

export const getProgramCourses = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const program = await Program.findById(id).populate({
    path: "courses",
    select: "code title courseType creditHours",
  });

  if (!program) return next(new AppError("Program not found", 404));

  res.status(200).json({
    status: "success",
    results: program.courses.length,
    courses: program.courses,
  });
});

