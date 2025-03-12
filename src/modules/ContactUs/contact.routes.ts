import express from "express";
import protectedRoutes from "../../middleware/authentication";
import {
  createContact,
  deleteContact,
  getAllContacts,
  updateContactStatus,
} from "./controller/contact.controller";
const contactRouter = express.Router();

contactRouter

  .post("/", protectedRoutes, createContact)

  .get("/", protectedRoutes, getAllContacts)
  .get("/:id", protectedRoutes, getAllContacts)

  .patch("/:id", protectedRoutes, updateContactStatus)
  .delete("/:id", protectedRoutes, deleteContact);

export default contactRouter;
