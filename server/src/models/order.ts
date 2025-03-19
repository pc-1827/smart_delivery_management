import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  area: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  status: 'pending' | 'assigned' | 'picked' | 'delivered';
  scheduledFor: string;
  assignedTo?: string;
  totalAmount: number;
}

const OrderSchema: Schema = new Schema(
  {
    orderNumber: { type: String, required: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    area: { type: String, required: true },
    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'assigned', 'picked', 'delivered'],
      default: 'pending',
    },
    scheduledFor: { type: String, default: '09:00' },
    assignedTo: { type: String, default: null },
    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', OrderSchema);