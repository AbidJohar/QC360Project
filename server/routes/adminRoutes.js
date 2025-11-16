import express from 'express';
import { getALlUsersByAdmin,
       updateUserByAdmin,
       deleteUserByAdmin,
       dashboardData,
       getAllSignUpRequestsByAdmin,
       approvedSignUpRequestsByAdmin,
       rejectedSignUpRequestsByAdmin,
       getSignUpRequestById
     } from '../controllers/adminController.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const adminRoutes = express.Router();

adminRoutes.get('/users', authMiddleware, roleMiddleware("Admin"), getALlUsersByAdmin);
adminRoutes.put('/users/:id', authMiddleware, roleMiddleware("Admin"), updateUserByAdmin);
adminRoutes.delete('/users/:id',authMiddleware, roleMiddleware("Admin"), deleteUserByAdmin);
adminRoutes.get('/dashboard', authMiddleware, roleMiddleware("Admin"), dashboardData);
adminRoutes.get('/viewrequests', authMiddleware, roleMiddleware("Admin", "Manager"), getAllSignUpRequestsByAdmin);
adminRoutes.put('/requests/approve', authMiddleware, roleMiddleware("Admin", "Manager"), approvedSignUpRequestsByAdmin);
adminRoutes.put('/requests/reject', authMiddleware, roleMiddleware("Admin", "Manager"), rejectedSignUpRequestsByAdmin);
adminRoutes.get('/requests/:id', authMiddleware, roleMiddleware("Admin", "Manager"), getSignUpRequestById);


export default adminRoutes;