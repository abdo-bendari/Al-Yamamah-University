import Joi from "joi";

const userValidationSchema = Joi.object({
  role: Joi.string()
    .valid("student", "faculty", "organization", "admin")
    .required(),
  firstName: Joi.string().trim().min(2).max(50).required(),
  lastName: Joi.string().trim().min(2).max(50).required(),
  phone: Joi.string().pattern(/^\+?\d{10,15}$/),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()-_+=]{6,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one letter, one number, and no spaces. Special characters are allowed but not required.",
    }),
  timezone: Joi.string().required(),
  otpCode: Joi.string().optional(),
  biography: Joi.string().optional(),
  publications: Joi.string().optional(),
  conferences: Joi.string().optional(),
  teaching: Joi.string().optional(),
  services: Joi.string().optional(),
  workingHours: Joi.string().optional(),
  otpExpires: Joi.date().optional(),
  profilePic: Joi.string().uri().optional(),
});

export default userValidationSchema;
