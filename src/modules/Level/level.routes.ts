import express from 'express';
import protectedRoutes, { allowedTo } from '../../middleware/authentication';
import * as L from './controller/level.controller';
import validation from '../../middleware/validation';
import levelValidation from './level.validation';

const levelRouter = express.Router();
levelRouter

.post ("/",protectedRoutes,allowedTo("admin"),validation(levelValidation),L.createLevel)

.get("/",protectedRoutes,L.getAllLevels)
.get("/:id",protectedRoutes,L.getLevelById)

.put("/:id",protectedRoutes,allowedTo("admin"),L.updateLevel)
.delete("/:id",protectedRoutes,allowedTo("admin"),L.deleteLevel)

export default levelRouter;