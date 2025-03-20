import { AppError } from "../../../utils/Error";
import catchError from "../../../middleware/catchError";
import { NextFunction, Request, Response } from "express";
import Contact from "../../../../database/models/Contact";
import sendEmail from "../../../utils/sendEmail";
import dotenv from "dotenv";
dotenv.config();

export const createContact = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return next(new AppError("Please provide all required fields", 400));
  }

  const contact = await Contact.create({ name, email, message });

  await sendEmail({
    to: process.env.EMAIL as string,
    subject: "New Contact Message Received",
    text: `You have received a new message from ${name} (${email}):\n\n"${message}"`,
  });

  return res.status(201).json({
    message: "Message sent successfully",
  });
});
  export const getAllContacts = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const contacts = await Contact.find().sort({ createdAt: -1 }).select("-__v");
  
    res.status(200).json({
      message: "All messages retrieved successfully",
      total: contacts.length,
      contacts,
    });
  });
  
  export const getContactById = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const contact = await Contact.findById(id).select("-__v");
  
    if (!contact) {
      return next(new AppError("Message not found", 404));
    }
  
    return res.status(200).json({
      message: "Message retrieved successfully",
      contact,
    });
  });
  
  export const updateContactStatus = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;
  
    if (!status || !["unread", "read"].includes(status)) {
      return next(new AppError("Invalid status", 400));
    }
  
    const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true });
  
    if (!contact) {
      return next(new AppError("Message not found", 404));
    }
  
    return res.status(200).json({
      message: "Message status updated successfully",
      contact,
    });
  });
  
  export const deleteContact = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);
  
    if (!contact) {
      return next(new AppError("Message not found", 404));
    }
  
    return res.status(200).json({
      message: "Message deleted successfully",
    });
  });