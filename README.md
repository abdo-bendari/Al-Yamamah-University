# 🎓 University Course Management System

A **production-ready backend system** built with **Node.js + TypeScript** to manage university programs, courses, levels, students' marks, enrollments, and more.  
This project simulates a **real-world academic management system** and is fully designed for extensibility, performance, and security.

---

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access (Admin, Instructor, Student)

- **Programs Management**
  - Create programs with all metadata (code, qualification level, mission, goals, outcomes, etc.)
  - Retrieve general program info
  - Fetch programs with their levels & courses

- **Courses Management**
  - Add/update courses with details (title, code, outcomes, credit hours, prerequisites, etc.)
  - Upload course images using `multer`
  - Link courses with programs and levels
  - Retrieve courses by program or level (with populated relations)

- **Levels Management**
  - Organize courses inside structured academic levels
  - Fetch levels with ordered data and related courses

- **Marks & Enrollment**
  - Students can be enrolled after successful payment
  - Instructors can assign/update marks
  - Retrieve marks by student or by course

- **Contact Us**
  - Contact form integration
  - Automatically sends email to admin using **Nodemailer**

- **Uploads**
  - Multer integration for handling images/files
  - Static serving for uploaded content

- **Validation**
  - Strong input validation using **Joi**
  - Custom reusable validation middleware

---

## 🛠️ Tech Stack

- **Node.js** + **Express.js**
- **TypeScript**
- **MongoDB** + **Mongoose**
- **Nodemailer** (emails)
- **Multer** (file uploads)
- **Stripe** (payments)
- **JWT** (authentication)
- **PM2 + Nginx** (deployment & production)

---

## 📂 Project Structure

