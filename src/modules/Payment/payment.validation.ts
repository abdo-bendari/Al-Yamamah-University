import Joi from "joi";
import mongoose from "mongoose";
import { PaymentStatus } from "../../../database/models/Payment";

export const paymentValidation = Joi.object({
  user: Joi.string()
    .custom((value, helpers) => {
      return mongoose.Types.ObjectId.isValid(value)
        ? value
        : helpers.error("any.invalid");
    })
    .required(),
  level: Joi.string()
    .custom((value, helpers) => {
      return mongoose.Types.ObjectId.isValid(value)
        ? value
        : helpers.error("any.invalid");
    })
    .allow(null),
  course: Joi.string()
    .custom((value, helpers) => {
      return mongoose.Types.ObjectId.isValid(value)
        ? value
        : helpers.error("any.invalid");
    })
    .allow(null),
  amount: Joi.number().positive().required(),
  currency: Joi.string().trim().uppercase().default("USD"),
  status: Joi.string()
    .valid(...Object.values(PaymentStatus))
    .default(PaymentStatus.PENDING),
  stripeSessionId: Joi.string().trim().required(),
});
