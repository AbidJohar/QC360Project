import { Router } from "express";
import { signIn, signup } from "../controllers/authController.js";

const authRoutes = Router();

authRoutes.post('/sign-up', signup);
authRoutes.post('/sign-in', signIn);


export default authRoutes;