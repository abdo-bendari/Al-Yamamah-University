import Joi from "joi";
import mongoose from "mongoose";

 const levelValidation = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  courses: Joi.array().items(
    Joi.string().custom((value, helpers) => {
      return mongoose.Types.ObjectId.isValid(value)
        ? value
        : helpers.error("any.invalid");
    })
  ),
  order: Joi.number().integer().min(1).required(),
  isPublished: Joi.boolean(),
  prerequisiteCoursesCount: Joi.number().integer().min(0).default(0),
});

export default levelValidation;