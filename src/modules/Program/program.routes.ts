import protectedRoutes,{ allowedTo } from "../../middleware/authentication";
import express from "express";
import * as Pr from "./controller/program.controller";
const programRouter = express.Router();

programRouter
  .post("/", protectedRoutes, allowedTo("admin"), Pr.createProgram)

  .get("/", protectedRoutes, Pr.getAllPrograms)

  .get("/:id/info", protectedRoutes, Pr.getProgramInfo)

  .get("/:id/full", protectedRoutes, Pr.getProgramWithLevels)

  .get("/:id/levels", protectedRoutes, Pr.getProgramLevels)

  .get("/:id/courses", protectedRoutes, Pr.getProgramCourses);

export default programRouter;
