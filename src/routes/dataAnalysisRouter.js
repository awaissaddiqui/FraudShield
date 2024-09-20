import express from 'express';
import dataAnaylsisController from '../controllers/dataAnaylsisController.js';


const router = express.Router();

router.get('/trends', dataAnaylsisController.getRecentTrends);
router.get('/pattern', dataAnaylsisController.getIdentifiedPattern);


export default router;