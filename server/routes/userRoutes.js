import { Router } from "express";
import { getProfile, updateProfile, changePassword } from "../controllers/userController.js"; 
import authMiddleware from '../middlewares/authMiddleware.js';

const userRoutes = Router();

userRoutes.get('/profile', authMiddleware ,getProfile);
userRoutes.put('/profile', authMiddleware ,updateProfile);
userRoutes.put('/change-password', authMiddleware ,changePassword);

export default userRoutes;