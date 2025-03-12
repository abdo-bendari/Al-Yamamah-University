import express from 'express';
import * as CT from './controller/category.controller';
import protectedRoutes, { allowedTo } from '../../middleware/authentication';
import validation from '../../middleware/validation';
import categoryValidation from './category.validation';

const categoryRouter = express.Router();
categoryRouter
.post("/",protectedRoutes,allowedTo("admin"),validation(categoryValidation) ,CT.createCategory)

.get("/", protectedRoutes,CT.getAllCategories)
.get("/:id",protectedRoutes, CT.getCategoryById)
.put("/:id", protectedRoutes,allowedTo("admin"),CT.updateCategory)

.delete("/:id", protectedRoutes,allowedTo("admin"),CT.deleteCategory)

.put("/:categoryId/addCourse",protectedRoutes,allowedTo("admin"),CT.addCourseToCategory)
.put("/:categoryId/removeCourse",protectedRoutes,allowedTo("admin"),CT.removeCourseFromCategory)

export default categoryRouter;





