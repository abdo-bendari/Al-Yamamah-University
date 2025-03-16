import express from 'express';
import protectedRoutes from '../../middleware/authentication';
// import {createCheckoutSession}  from './controller/payment.controller';

const paymentRouter = express.Router();

// paymentRouter
// .post('/', protectedRoutes,createCheckoutSession)

export default paymentRouter;