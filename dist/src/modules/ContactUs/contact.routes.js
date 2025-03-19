"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = __importDefault(require("../../middleware/authentication"));
const contact_controller_1 = require("./controller/contact.controller");
const contactRouter = express_1.default.Router();
contactRouter
    .post("/", authentication_1.default, contact_controller_1.createContact)
    .get("/", authentication_1.default, contact_controller_1.getAllContacts)
    .get("/:id", authentication_1.default, contact_controller_1.getContactById)
    .patch("/:id", authentication_1.default, contact_controller_1.updateContactStatus)
    .delete("/:id", authentication_1.default, contact_controller_1.deleteContact);
exports.default = contactRouter;
