import express from 'express';
import userController from '../controllers/userController.js';
const router = express.Router();

router.post('/login', userController.login)

router.post('/register', userController.register);
router.get('/signout', userController.signOut);
router.post('/forget-password', userController.forgetPassword);
router.get('/user', userController.authenticatedUser);
router.put('/update', userController.updateProfile);
router.get('/currentuser', userController.getUserProfile);
router.delete('/delete', userController.deleteUser);
router.put('/change-password', userController.changePassword);

export default router;