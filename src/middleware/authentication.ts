import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import catchError from "./catchError";
import { AppError } from "../utils/Error";
import User from "../../database/models/User";
import dotenv from "dotenv";
import { Types } from "mongoose";

dotenv.config()
interface UserPayload {
  userId: Types.ObjectId;
  role: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserPayload;
  }
}

const protectedRoutes = catchError(async (req: Request, res: Response, next: NextFunction) => {
  // authentication
  const token = req.headers.token as string | undefined;
  if (!token) return next(new AppError("token not provided", 400));

  try {
    const userPayload = jwt.verify(token, process.env.JWT_KEY as string) as UserPayload;
    const user = await User.findById(userPayload.userId);

    if (!user) return next(new AppError("user not found", 400));
    req.user = { userId: user._id, role: user.role } as UserPayload;
    next();
  } catch (err) {
    return next(new AppError("Invalid token or token expired", 401));
  }
});

export const allowedTo = (...roles: string[]) => {
  // authorization
  return catchError(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("you are not authorized to access this endpoint", 401));
    }
    next();
  });
};

export default protectedRoutes;