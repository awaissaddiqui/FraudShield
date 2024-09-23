import fraudController from "../controllers/fraudController.js";
import express from 'express';

const router = express.Router();

router.get('/all', fraudController.getAllFraudReports);
router.get('/single', fraudController.getFraudReportById);
router.post('/add-report', fraudController.addFraudReport);
router.put('/update-report', fraudController.updateReport);


export default router;