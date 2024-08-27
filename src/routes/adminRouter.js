
import express from 'express'
import adminContoller from '../controllers/adminContoller.js';
const router = express.Router();

router.delete('/:repID/delete', adminContoller.deleteReport);
router.put('/:repID/update', adminContoller.editReport);

export default router;