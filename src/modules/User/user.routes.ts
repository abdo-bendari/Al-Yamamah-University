import express from 'express';
import * as U from './controller/user.controller';
import protectedRoutes, { allowedTo } from '../../middleware/authentication';

const userRouter = express.Router();

userRouter

.get("/students", U.getStudents)
.get("/faculty", U.getFaculty)
.get("/organizations", U.getOrganizations)

.get("/students/count", U.getStudentsCount)
.get("/faculty/count", U.getFacultyCount)
.get("/organizations/count", U.getOrganizationsCount)

.get("/by-name/:name", U.getUserByName)
.get("/byId/:id", U.getUserById)

.put("/update",protectedRoutes,U.updateProfile)
.patch("/profilePic",protectedRoutes,U.uploadProfilePicture)

.delete("/delete/:id",protectedRoutes,allowedTo("admin"),U.deleteUser)

export default userRouter;