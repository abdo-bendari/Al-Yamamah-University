import express from 'express';
import protectedRoutes, { allowedTo } from '../../middleware/authentication';
import * as M from './controller/mark.controller';

const markRouter = express.Router();

markRouter

.post("/add", protectedRoutes,allowedTo("faculty") ,M.addMark)

.patch("/:markId", protectedRoutes,allowedTo("faculty") , M.updateMark)

.get("/student/:userId", protectedRoutes, M.getMarksForStudent)
.get("/course/:courseId", protectedRoutes, M.getMarksForCourse)

.delete("/:markId", protectedRoutes,allowedTo("faculty") , M.deleteMark); 

export default markRouter;