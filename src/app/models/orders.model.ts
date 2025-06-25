export interface Order {
    orderId: string;
    paymentStatusId: number;
    carrier: string;
    userId?: string;
    paymentTypeId: number;
    deliveryAddress: string;
    total: number;
    deliveryName?: string;
    userDeliveryId?: string;
    deliveryId?: string;
    products?: any[];
  }