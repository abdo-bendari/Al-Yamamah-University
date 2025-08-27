
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

```
src/
 ┣ database/
 ┃ ┗ models/       
 ┃    ┣ Course.ts
 ┃    ┣ Level.ts
 ┃    ┣ Program.ts
 ┃    ┣ User.ts
 ┃    ┣ Mark.ts
 ┃    ┣ Enrollment.ts
 ┃    ┗ Contact.ts
 ┣ modules/
 ┃ ┣ course/
 ┃ ┃ ┣ course.controller.ts
 ┃ ┃ ┣ course.routes.ts
 ┃ ┃ ┗ course.validation.ts
 ┃ ┣ program/
 ┃ ┃ ┣ program.controller.ts
 ┃ ┃ ┣ program.routes.ts
 ┃ ┃ ┗ program.validation.ts
 ┃ ┣ level/
 ┃ ┃ ┣ level.controller.ts
 ┃ ┃ ┗ level.routes.ts
 ┃ ┣ mark/
 ┃ ┃ ┣ mark.controller.ts
 ┃ ┃ ┗ mark.routes.ts
 ┃ ┣ enrollment/
 ┃ ┃ ┣ enrollment.controller.ts
 ┃ ┃ ┗ enrollment.routes.ts
 ┃ ┣ contact/
 ┃ ┃ ┣ contact.controller.ts
 ┃ ┃ ┗ contact.routes.ts
 ┣ middleware/
 ┃ ┣ catchError.ts
 ┃ ┣ validation.ts
 ┃ ┗ auth.ts
 ┣ utils/
 ┃ ┣ Error.ts
 ┃ ┣ sendEmail.ts
 ┃ ┗ uploadFile.ts
 ┣ server.ts
 ┗ app.ts
```

---

## ⚡ API Endpoints (Samples)

### Programs
- `POST /api/programs` → Create new program
- `GET /api/programs` → List all programs (title, code)
- `GET /api/programs/:id` → Full program info
- `GET /api/programs/:id/levels` → Levels for a program
- `GET /api/programs/:id/courses` → Courses for a program

### Courses
- `POST /api/courses` → Create new course (with image upload)
- `GET /api/courses/program/:programId` → Get courses by program
- `GET /api/courses/level/:levelId` → Get courses by level

### Marks
- `POST /api/marks` → Instructor adds mark
- `PUT /api/marks/:id` → Update mark
- `GET /api/marks/student/:studentId` → Get student’s marks
- `GET /api/marks/course/:courseId` → Get marks for a course

### Enrollment
- `POST /api/enroll` → Enroll user after payment
- `GET /api/enrollments/:userId` → Get user enrollments

### Contact
- `POST /api/contact` → Send message to admin email

---

## 🔧 Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/university-course-management.git
cd university-course-management
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Setup Environment Variables
Create a `.env` file in root:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/university-system
JWT_SECRET=your-secret
EMAIL=your-email@gmail.com
EMAIL_PASSWORD=your-email-password
STRIPE_SECRET=your-stripe-secret
```

### 4️⃣ Run in Development
```bash
npm run dev
```

### 5️⃣ Build & Run in Production
```bash
npm run build
pm2 start dist/server.js
```

---

## 🌐 Deployment

- Deployed using **PM2** + **Nginx** for reverse proxy
- Static uploads served from `/uploads`
- Scalable and ready for production environments

---

## 👨‍💻 Author

**Abdelrahman Bendari**  
Backend Developer | Node.js & TypeScript Specialist  

- GitHub: [abdo-bendari](https://github.com/abdo-bendari)  
- LinkedIn: [Abdelrahman Bendari](https://www.linkedin.com/in/abdelrahman-bendari-757a62328/)  
- Email: abdobeendari@gmail.com  

---

## 📜 License
This project is licensed under the **MIT License**.
