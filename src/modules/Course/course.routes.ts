import * as C from './controller/course.controller';
import protectedRoutes ,{allowedTo} from '../../middleware/authentication';
import express from 'express';
import validation from '../../middleware/validation';
import courseValidationSchema from './course.validation';

const courseRouter = express.Router();
courseRouter
.post("/",protectedRoutes,allowedTo("admin","instructor"),validation(courseValidationSchema), C.createCourse)

.get("/", protectedRoutes,C.getAllCourses)

.get("/:id", protectedRoutes,C.getCourseById)

.get("/search/:search",protectedRoutes ,C.getCourseByTitleOrDescription)

.get("/instructor/:instructorId", protectedRoutes,C.getCoursesByInstructor)

.get("/category/:categoryId", protectedRoutes,C.getCoursesByCategory)

.put("/:courseId",protectedRoutes ,allowedTo("admin","instructor"),C.updateCourse)

.delete("/:courseId", protectedRoutes ,allowedTo("admin","instructor"),C.deleteCourse);


export default courseRouter;