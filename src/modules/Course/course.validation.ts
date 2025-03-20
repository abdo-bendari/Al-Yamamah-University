import Joi from "joi";
import mongoose from "mongoose";

const courseValidationSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required(),
  code: Joi.string().trim().required(),
  description: Joi.string().trim().min(10).max(1000).required(),
  instructor: Joi.string()
    .custom((value, helpers) => {
      return mongoose.Types.ObjectId.isValid(value)
        ? value
        : helpers.error("any.invalid");
    })
    .required(),
  price: Joi.number().min(0).optional(),
  studentsEnrolled: Joi.number().integer().min(0).default(0),
  rating: Joi.number().min(0).max(5).default(0),
  category: Joi.string()
    .custom((value, helpers) => {
      return mongoose.Types.ObjectId.isValid(value)
        ? value
        : helpers.error("any.invalid");
    })
    .required(),
  isPublished: Joi.boolean().default(false),
  isPaid: Joi.boolean().default(false),
  creditHours: Joi.number().integer().min(1).required(),
  courseType: Joi.string().valid("required", "elective").required(),
  prerequisites: Joi.array()
    .items(
      Joi.string().custom((value, helpers) => {
        return mongoose.Types.ObjectId.isValid(value)
          ? value
          : helpers.error("any.invalid");
      })
    )
    .optional(),
  requirementType: Joi.string().valid("college", "institution").optional(),
  content: Joi.array()
    .items(
      Joi.object({
        moduleTitle: Joi.string().trim().required(),
        videos: Joi.array()
          .items(
            Joi.object({
              title: Joi.string().trim().required(),
              videoUrl: Joi.string().trim().uri().required(),
              materials: Joi.array()
                .items(Joi.string().trim().uri())
                .optional(),
            })
          )
          .required(),
      })
    )
    .optional(),
  reviews: Joi.array()
    .items(
      Joi.object({
        comment: Joi.string().trim().required(),
        rating: Joi.number().min(1).max(5).required(),
        user: Joi.string()
          .custom((value, helpers) => {
            return mongoose.Types.ObjectId.isValid(value)
              ? value
              : helpers.error("any.invalid");
          })
          .required(),
      })
    )
    .default([]),
  imageUrl: Joi.string()
});

export default courseValidationSchema;
