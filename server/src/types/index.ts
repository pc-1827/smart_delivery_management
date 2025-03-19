export interface DeliveryPartner {
    id: string;
    name: string;
    contactNumber: string;
    email: string;
    status: 'active' | 'inactive';
}

export interface Order {
    id: string;
    partnerId: string;
    customerName: string;
    deliveryAddress: string;
    status: 'pending' | 'in-progress' | 'completed' | 'canceled';
    createdAt: Date;
    updatedAt: Date;
}

export interface Assignment {
    id: string;
    orderId: string;
    partnerId: string;
    assignedAt: Date;
    completedAt?: Date;
}

export interface AssignmentMetrics {
    totalAssignments: number;
    completedAssignments: number;
    pendingAssignments: number;
}