import User from "../../../../database/models/User";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../utils/Error";
import catchError from "../../../middleware/catchError";


const getUsersByRole = async (role: string, req: Request, res: Response, next: NextFunction) => {
    const { page = 1 } = req.query;
    const limit = 10; 

    const totalUsers = await User.countDocuments({ role });

    const users = await User.find({ role })
        .select("firstName lastName role profilePic biography publications conferences teaching services workingHours timezone phone email")
        .skip((Number(page) - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        
    return res.status(200).json({
        message: `${role}s found`,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: Number(page),
        users,
    });
};
export const getStudents = catchError(async (req: Request, res: Response, next: NextFunction) => {
    await getUsersByRole("student", req, res, next);
});

export const getFaculty = catchError(async (req: Request, res: Response, next: NextFunction) => {
    await getUsersByRole("faculty", req, res, next);
});

export const getOrganizations = catchError(async (req: Request, res: Response, next: NextFunction) => {
    await getUsersByRole("organization", req, res, next);
});

export const getStudentsCount = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const count = await User.countDocuments({ role: "student" });
    res.status(200).json({ role: "students", count });
});

export const getFacultyCount = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const count = await User.countDocuments({ role: "faculty" });
    res.status(200).json({ role: "faculty", count });
});

export const getOrganizationsCount = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const count = await User.countDocuments({ role: "organization" });
    res.status(200).json({ role: "organizations", count });
});

export const getUserByName = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.params;
    
    const users = await User.find({
        $or: [
            { firstName: { $regex: new RegExp(name, "i") } },
            { lastName: { $regex: new RegExp(name, "i") } }
        ]
    }).select("firstName lastName role");

    if (!users.length) return next(new AppError("No users found with this name", 404));
    
    return res.status(200).json({ status: 200, users });
});

export const getUserById = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    const user = await User.findById(id).select("firstName lastName role");
    if (!user) return next(new AppError("User not found", 404));
    
    return res.status(200).json({ status: 200, user });
});

export const updateProfile = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId
    if (!userId) return next(new AppError("User not found", 404));

    const { firstName, lastName, phone, timezone ,biography, publications ,conferences,teaching,
    services } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { firstName, lastName, phone, timezone,biography, publications ,conferences,teaching,
    services },
        { new: true , runValidators: true ,select: "-password -email"}
    );

    if (!updatedUser) return next(new AppError("User not found", 404));

    return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
});
export const uploadProfilePicture = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId
    if (!userId) return next(new AppError("User not found", 404));

    const { profilePicture } = req.body

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic : profilePicture },
        { new: true , runValidators: true ,select: "-password -email"}
    );

    if (!updatedUser) return next(new AppError("User not found", 404));

    return res.status(200).json({ message: "Profile picture updated successfully", user: updatedUser });
});

export const deleteUser = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const {id}= req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return next(new AppError("User not found", 404));

    return res.status(200).json({ message: "Account deleted successfully" });
});

export const updateUser = catchError(async (req: Request, res: Response, next: NextFunction) => {
    const {userId} = req.params;
    if (!userId) return next(new AppError("User not found", 404));

    const user = await User.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true, select: "-password -email" });

    if (!user) return next(new AppError("User not found", 404));

    return res.status(200).json({ message: "User updated successfully", user });
});

