import express from 'express';
import { getColleges, getCollegeById, verifyCollegeEmail } from '../controllers/additional.controller.js';

const router = express.Router();

router.get('/', getColleges);
router.get('/:id', getCollegeById);
router.post('/verify-email', verifyCollegeEmail);

export default router;
