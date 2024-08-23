import express from 'express';
import userController from '../controllers/userController.js';
const router = express.Router();

router.post('/login', userController.login)

router.post('/register', userController.register);
router.get('/signout', userController.signOut);
router.post('/forgetpassword', userController.forgetPassword);
router.get('/user', userController.authenticatedUser)

export default router;