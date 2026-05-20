import express from 'express';
import { createBoard, getBoard } from '../controllers/board.controller.js';

const router = express.Router();

router.post('/create', createBoard);
router.get('/:id', getBoard);

export default router;