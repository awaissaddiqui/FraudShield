import express from 'express';
import { validateSecretAndApiKey } from '../middleware/authMiddleware.js';
import apiController from '../controllers/apiController.js';

const router = express.Router();
router.post('/get-report-detail', validateSecretAndApiKey, apiController.getFraudReportByEmailNameCNICPhone);
router.post('/get-report-detail/recent', validateSecretAndApiKey, apiController.getRecentFraudReport);

export default router;