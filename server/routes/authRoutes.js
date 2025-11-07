import { Router } from "express";
import { signIn, signup, logout } from "../controllers/authController.js";

const authRoutes = Router();

authRoutes.post('/sign-up', signup);
authRoutes.post('/sign-in', signIn);
authRoutes.get('/logout', logout);


export default authRoutes;