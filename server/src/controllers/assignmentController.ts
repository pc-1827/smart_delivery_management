import { RequestHandler } from 'express';
import Assignment from '../models/assignment';
import Order from '../models/order';
import { DeliveryPartner } from '../models/partner';
import moment from 'moment';

// Existing functions
export const executeAssignment: RequestHandler = async (req, res) => {
  try {
    const { orderId, status, reason } = req.body;
    if (!orderId || !status) {
      res.status(400).json({ message: 'Missing orderId or status' });
      return;
    }
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    const assignment = new Assignment({
      orderId,
      partnerId: order.assignedTo || '',
      status,
      reason: reason || ''
    });
    await assignment.save();

    // Adjust the order status
    if (status === 'success') {
      order.status = 'delivered';
      await order.save();
    } else if (status === 'failed') {
      order.status = 'pending';
      await order.save();
    }

    // Decrement partner load, update partner metrics
    if (order.assignedTo) {
      const partner = await DeliveryPartner.findById(order.assignedTo);
      if (partner) {
        partner.currentLoad = Math.max(0, partner.currentLoad - 1);
        if (status === 'success') {
          partner.metrics.completedOrders++;
        } else {
          order.assignedTo = '';
          partner.metrics.cancelledOrders++;
        }
        // Recalc rating = success / total
        const totalAssignments = partner.metrics.completedOrders + partner.metrics.cancelledOrders;
        partner.metrics.rating = totalAssignments ? partner.metrics.completedOrders / totalAssignments : 0;
        await partner.save();
      }
    }

    res.status(200).json({ assignment });
  } catch (error) {
    res.status(500).json({ message: 'Error executing assignment', error });
  }
};

// Enhance getAssignmentMetrics to return total assignments, success rate
export const getAssignmentMetrics: RequestHandler = async (req, res) => {
  try {
    const totalAssignments = await Assignment.countDocuments({});
    const successful = await Assignment.countDocuments({ status: 'success' });
    const successRate = totalAssignments ? (successful / totalAssignments) * 100 : 0;
    res.status(200).json({ totalAssignments, successRate });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving assignment metrics', error });
  }
};

// Added CRUD functions
export const createAssignment: RequestHandler = async (req, res) => {
  try {
    const assignment = new Assignment(req.body);
    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({ message: 'Error creating assignment', error });
  }
};

export const getAssignments: RequestHandler = async (req, res) => {
    try {
      const query: any = {};
      if (req.query.partnerId) {
        query.partnerId = req.query.partnerId;
      }
      const assignments = await Assignment.find(query);
      res.status(200).json(assignments);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving assignments', error });
    }
  };

export const updateAssignment: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Assignment.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ message: 'Assignment not found' });
      return;
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating assignment', error });
  }
};

export const deleteAssignment: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Assignment.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ message: 'Assignment not found' });
      return;
    }
    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting assignment', error });
  }
};

// // This is now a plain async function returning the count of assigned orders.
// export async function autoAssignOrdersService(): Promise<number> {
//   const pendingOrders = await Order.find({ status: 'pending' });
//   let assignedCount = 0;

//   for (const order of pendingOrders) {
//     // Skip if no longer pending
//     if (order.status !== 'pending') continue;

//     // Find a suitable partner
//     const suitablePartner = await DeliveryPartner.findOne({
//       currentLoad: { $lt: 3 },
//       areas: order.area,
//       status: 'active',
//     });
//     if (!suitablePartner) continue;

//     // Check shift
//     const now = moment();
//     const shiftStart = moment(suitablePartner.shift.start, 'HH:mm');
//     const shiftEnd = moment(suitablePartner.shift.end, 'HH:mm');
//     if (!now.isBetween(shiftStart, shiftEnd)) continue;

//     // Assign the order
//     const assignment = new Assignment({
//       orderId: order._id,
//       partnerId: suitablePartner._id,
//       status: 'success',
//     });
//     await assignment.save();
//     order.status = 'assigned';
//     order.assignedTo = String(suitablePartner._id);
//     await order.save();

//     suitablePartner.currentLoad++;
//     await suitablePartner.save();

//     assignedCount++;
//   }

//   return assignedCount;
// }

// // Route handler calling the service function
// export const autoAssignOrders: RequestHandler = async (req, res) => {
//   try {
//     const assigned = await autoAssignOrdersService();
//     res.status(200).json({ message: `Assigned ${assigned} orders.` });
//   } catch (error) {
//     res.status(500).json({ message: 'Error auto-assigning orders', error });
//   }
// };