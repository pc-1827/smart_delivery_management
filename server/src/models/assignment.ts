import { Schema, model, Document } from 'mongoose';

export interface IAssignment extends Document {
  orderId: string;
  partnerId: string;
  timestamp: Date;
  status: 'success' | 'failed';
  reason?: string;
}

const assignmentSchema = new Schema<IAssignment>(
  {
    orderId: { type: String, required: true },
    partnerId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['success', 'failed'], default: 'success' },
    reason: { type: String, default: '' },
  },
  { timestamps: true }
);

// Example static methods to fix references in assignmentController:
assignmentSchema.statics.getMetrics = async function () {
  // placeholder for retrieving assignment metrics
  return { totalAssigned: 0, successRate: 0, averageTime: 0, failureReasons: [] };
};

assignmentSchema.statics.execute = async function (assignmentId: string) {
  // placeholder for executing assignment logic
  return { message: 'Assignment executed', assignmentId };
};

const Assignment = model<IAssignment>('Assignment', assignmentSchema);

export default Assignment;