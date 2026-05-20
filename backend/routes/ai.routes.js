import express from 'express';
import { critique, expand, validate, convert } from '../controllers/ai.controller.js';

const router = express.Router();

router.post('/critique', critique);
router.post('/expand', expand);
router.post('/validate', validate);
router.post('/convert', convert);

export default router;