import validation from '../../middleware/validation';
import { checkEmail } from './../../middleware/checkEmail';
import userValidationSchema from './auth.validation';
import * as A  from './controller/auth.controller';
import express from 'express';

const authRouter = express.Router();

authRouter
  .post("/signUp", checkEmail,validation(userValidationSchema) ,A.signUp)

  .post("/signIn", A.signIn)

  .post("/forgot-password", A.forgetPassword)

  .post("/reset-password", A.resetPassword)
  
  .post("/resend-otp", A.resendOtp);

export default authRouter;