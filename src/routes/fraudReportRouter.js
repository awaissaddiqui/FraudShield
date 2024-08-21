import fraudController from "../controllers/fraudController.js";
import express from 'express';
const router = express.Router();

router.get('/getAllFraudUsers', fraudController.getAllFraudUsers);
router.get('/getAllFraudUsers/:id', fraudController.getFraudUserById);
router.post('/addFraudUser', fraudController.addFraudUser);
router.put('/updateFraudUser/:id', fraudController.updateFraudUser);
router.delete('/deleteFraudUser/:id', fraudController.deleteFraudUser);



export default router;