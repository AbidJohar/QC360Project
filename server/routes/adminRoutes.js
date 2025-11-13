import express from 'express';
 
import { getALlUsersByAdmin, updateUserByAdmin,deleteUserByAdmin, dashboardData } from '../controllers/adminController.js';
import  adminMiddleware  from '../middlewares/adminMiddleware.js';

const adminRoutes = express.Router();

adminRoutes.get('/users', adminMiddleware, getALlUsersByAdmin);
adminRoutes.put('/users/:id', adminMiddleware, updateUserByAdmin);
adminRoutes.delete('/users/:id', adminMiddleware, deleteUserByAdmin);
adminRoutes.get('/dashboard', adminMiddleware, dashboardData)


export default adminRoutes;