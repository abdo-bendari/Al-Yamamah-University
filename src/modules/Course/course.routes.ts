import * as C from './controller/course.controller';
import protectedRoutes ,{allowedTo} from '../../middleware/authentication';
import express from 'express';
import validation from '../../middleware/validation';
import courseValidationSchema from './course.validation';

const courseRouter = express.Router();
courseRouter
.post("/",protectedRoutes,allowedTo("admin","faculty"),validation(courseValidationSchema), C.createCourse)

.get("/", protectedRoutes,C.getAllCourses)

.get("/:id", protectedRoutes,C.getCourseById)

.get("/search/:search",protectedRoutes ,C.getCourseByTitleOrDescription)

.get("/instructor/:instructorId", protectedRoutes,C.getCoursesByInstructor)

.get("/category/:categoryId", protectedRoutes,C.getCoursesByCategory)
.get("/courseReviews/:courseId", protectedRoutes,C.getCourseReviews)

.get("/freeCourses", protectedRoutes,C.getFreeCourses)
.get("/paidCourses", protectedRoutes,C.getPaidCourses)

.put("/:courseId",protectedRoutes ,allowedTo("admin","faculty"),C.updateCourse)
.put("/addReview/:courseId",protectedRoutes ,C.addCourseReview)

.delete("/:courseId", protectedRoutes ,allowedTo("admin"),C.deleteCourse);


export default courseRouter;