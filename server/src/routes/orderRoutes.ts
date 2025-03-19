import { Router } from 'express';
import {
  createOrder,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} from '../controllers/orderController';

const router = Router();

// Create
router.post('/', createOrder);

// Read
router.get('/:id', getOrderById);

// Update
router.put('/:id', updateOrderStatus);

// Delete
router.delete('/:id', deleteOrder);

export default router;