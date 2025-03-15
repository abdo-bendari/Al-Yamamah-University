import express from 'express';
import * as E from './controller/enrollment.controller';
import protectedRoutes, { allowedTo } from '../../middleware/authentication';
const enrollmentRouter = express.Router();
enrollmentRouter

.post("/enroll", protectedRoutes,E.enrollUser)

.get("/user/:userId/", protectedRoutes,E.getUserEnrollments)
.get("/:enrollmentId", protectedRoutes,E.getEnrollment)

.patch("/:enrollmentId", protectedRoutes,allowedTo("admin"),E.updateEnrollment)
.delete("/:enrollmentId",protectedRoutes,allowedTo("admin"), E.deleteEnrollment)

export default enrollmentRouter;