export interface Order {
    orderId: string;
    paymentStatusId: number;
    carrier: string;
    userId?: string;
    paymentTypeId: number;
    deliveryAddress: string;
    total: number;
  }