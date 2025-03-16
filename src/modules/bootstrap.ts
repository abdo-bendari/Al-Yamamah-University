import { AppError } from "./../utils/Error";
import express, { Express, Request, Response, NextFunction } from "express";
import globalError from "../middleware/globalError";
import userRouter from "./User/user.routes";
import authRouter from "./Auth/auth.routes";
import courseRouter from "./Course/course.routes";
import categoryRouter from "./Category/category.routes";
import levelRouter from "./Level/level.routes";
import enrollmentRouter from "./Enrollment/enrollment.routes";
import paymentRouter from "./Payment/payment.routes";
import contactRouter from "./ContactUs/contact.routes";
import markRouter from "./Mark/mark.routes";

const bootstrap = (app: Express) => {
  process.on("uncaughtException", (err: Error) => {
    console.error("Uncaught Exception:", err);
  });
  app.use(express.json());
  const baseUrl = "/api/v1";
  // Uncomment these routes once you have the routers ready
  app.use(`${baseUrl}/auth`, authRouter);
  app.use(`${baseUrl}/users`, userRouter);
  app.use(`${baseUrl}/courses`, courseRouter);
  app.use(`${baseUrl}/categories`, categoryRouter);
  app.use(`${baseUrl}/levels`, levelRouter);
  app.use(`${baseUrl}/enrollments`, enrollmentRouter);
  app.use(`${baseUrl}/payments`, paymentRouter);
  app.use(`${baseUrl}/contact`, contactRouter);
  app.use(`${baseUrl}/marks`,markRouter );
  app.use("*", (req: Request, res: Response, next: NextFunction) => {
    next(new AppError("Route not found", 404));
  });
  process.on("unhandledRejection", (err: Error) => {
    console.error("Unhandled Rejection:", err);
  });
  app.use(globalError);
};

export default bootstrap;
