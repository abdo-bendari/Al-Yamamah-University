import Joi from "joi";
import mongoose from "mongoose";

 const categoryValidation = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().max(500),
  courses: Joi.array().items(Joi.string().custom((value, helpers) => {
    return mongoose.Types.ObjectId.isValid(value)
      ? value
      : helpers.error("any.invalid");
  })),
});

export default categoryValidation;
