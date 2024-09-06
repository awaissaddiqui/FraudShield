import express from 'express';
import dataAnaylsisController from '../controllers/dataAnaylsisController.js';
import analyzeEvidence from '../models/analyzeEvidence.js';

const router = express.Router();

router.get('/trends', dataAnaylsisController.getRecentTrends);
router.get('/pattern', dataAnaylsisController.getIdentifiedPattern);


export default router;