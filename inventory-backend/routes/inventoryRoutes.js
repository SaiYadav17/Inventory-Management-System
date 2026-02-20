import express from 'express';
import {
    getInventory,
    createInventory,
    updateInventory,
    deleteInventory,
} from '../controllers/inventoryController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getInventory)
    .post(protect, adminOnly, createInventory);

router.route('/:id')
    .put(protect, adminOnly, updateInventory)
    .delete(protect, adminOnly, deleteInventory);

export default router;
