import express from 'express';
import * as U from './controller/user.controller';
import protectedRoutes, { allowedTo } from '../../middleware/authentication';

const userRouter = express.Router();

userRouter

.get("/students", protectedRoutes,U.getStudents)
.get("/instructors", protectedRoutes,U.getFaculty)
.get("/organizations", protectedRoutes,U.getOrganizations)

.get("/students/count", protectedRoutes,U.getStudentsCount)
.get("/faculty/count",protectedRoutes,U.getFacultyCount)
.get("/organizations/count", protectedRoutes,U.getOrganizationsCount)

.get("/by-name/:name", protectedRoutes,U.getUserByName)
.get("/byId/:id", protectedRoutes,U.getUserById)

.put("/update",protectedRoutes,U.updateProfile)
.patch("/profilePic",protectedRoutes,U.uploadProfilePicture)

.delete("/delete/:id",protectedRoutes,allowedTo("admin"),U.deleteUser)

export default userRouter;