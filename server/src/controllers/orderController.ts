import { RequestHandler } from 'express';
import Order from '../models/order';
import Assignment from '../models/assignment';
import { DeliveryPartner } from '../models/partner';
import moment from 'moment';

export const getAllOrders: RequestHandler = async (req, res) => {
  try {
    const query: any = {};
    if (req.query.assignedTo) {
      query.assignedTo = req.query.assignedTo; // enforce partner filter
    }
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving orders', error });
  }
};

export const getOrderById: RequestHandler = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving order', error });
  }
};

export const createOrder: RequestHandler = async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    autoAssignPendingOrders();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error creating order', error });
  }
};

export const updateOrderStatus: RequestHandler = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedOrder) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error updating order', error });
  }
};

export const deleteOrder: RequestHandler = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    // Simply send; do not return
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
  }
};

export const completeOrder: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    if (order.status !== 'assigned' && order.status !== 'picked') {
      res.status(400).json({ message: 'Order is not in a completable state' });
      return;
    }

    // Mark order delivered
    order.status = 'delivered';
    await order.save();

    // Update assignment
    const assignment = await Assignment.findOne({ orderId: id }).sort({ createdAt: -1 });
    if (assignment) {
      assignment.status = 'success';
      assignment.timestamp = moment().toDate();
      await assignment.save();
    }

    // Decrement partner load, increment completed
    if (order.assignedTo) {
      const partner = await DeliveryPartner.findById(order.assignedTo);
      if (partner) {
        partner.currentLoad = Math.max(0, partner.currentLoad - 1);
        partner.metrics.completedOrders++;
        await partner.save();
      }
    }

    // Re-run auto-assign logic (no Express params needed)
    await autoAssignPendingOrders();

    res.status(200).json({ message: 'Order completed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error completing order', error });
  }
};

export async function autoAssignPendingOrders(): Promise<number> {
  const pendingOrders = await Order.find({ status: 'pending' });
  let assignedCount = 0;

  for (const order of pendingOrders) {
    if (order.status !== 'pending') continue;

    // Find suitable partner
    const suitablePartner = await DeliveryPartner.findOne({
      currentLoad: { $lt: 3 },
      areas: order.area,
      status: 'active'
    });

    if (!suitablePartner) continue;
    // Check shift
    const now = moment();
    const shiftStart = moment(suitablePartner.shift.start, 'HH:mm');
    const shiftEnd = moment(suitablePartner.shift.end, 'HH:mm');
    if (!now.isBetween(shiftStart, shiftEnd)) continue;

    // Assign the order but do NOT create an Assignment doc yet.
    order.status = 'assigned';
    order.assignedTo = String(suitablePartner._id);
    await order.save();

    suitablePartner.currentLoad++;
    await suitablePartner.save();

    assignedCount++;
  }
  return assignedCount;
}
