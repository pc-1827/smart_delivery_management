import { Router } from 'express';
import {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  completeOrder
} from '../controllers/orderController';

const router = Router();

// Create
router.post('/', createOrder);

// Read
router.get('/:id', getOrderById);
router.get('/', getAllOrders);

// Update
router.put('/:id', updateOrderStatus);
router.put('/:id/complete', completeOrder); // new route to mark an order complete

// Delete
router.delete('/:id', deleteOrder);

export default router;