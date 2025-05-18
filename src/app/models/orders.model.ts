export interface Order {
    id: string;
    status: string;
    carrier: string;
    paymentMethod: string;
    address: string;
    total: number;
  }