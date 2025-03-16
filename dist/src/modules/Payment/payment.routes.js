"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import {createCheckoutSession}  from './controller/payment.controller';
const paymentRouter = express_1.default.Router();
// paymentRouter
// .post('/', protectedRoutes,createCheckoutSession)
exports.default = paymentRouter;
