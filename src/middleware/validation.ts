import { Request, Response, NextFunction, RequestHandler } from "express";
import { ObjectSchema } from "joi";

const validation = (schema: ObjectSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const inputData = {
      ...req.body,
      ...req.params,
      ...req.query,
    };

    const { error } = schema.validate(inputData, { abortEarly: false });

    if (error) {
      res.status(400).json({ message: "Validation error", error: error.details });
      return;
    }

    next();
  };
};

export default validation;
