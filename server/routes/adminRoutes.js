import express from 'express';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import { getALlUsersByAdmin, updateUserByAdmin,deleteUserByAdmin } from '../controllers/adminController';


const adminRoutes = express.Router();



adminRoutes.post('/users', adminMiddleware, getALlUsersByAdmin);
adminRoutes.put('/update-user/:id', adminMiddleware, updateUserByAdmin);
adminRoutes.delete('/delete-user/:id', adminMiddleware, deleteUserByAdmin);

export default adminRoutes;