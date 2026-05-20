import express from 'express';
import { createNode, updateNode, deleteNode } from '../controllers/node.controller.js';

const router = express.Router();

router.post('/', createNode);
router.put('/:id', updateNode);
router.delete('/:id', deleteNode);

export default router;