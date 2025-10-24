import { Router } from "express";
import { getProfile, updateProfile, changePassword } from "../controllers/userController.js"; 
import authMiddleware from '../middlewares/authMiddleware.js';

const userRoutes = Router();

userRoutes.get('/get-Profile', authMiddleware ,getProfile);
userRoutes.get('/update-Profile', authMiddleware ,updateProfile);
userRoutes.get('/change-password', authMiddleware ,changePassword);



export default userRoutes;