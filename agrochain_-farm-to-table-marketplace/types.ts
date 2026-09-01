
export enum UserRole {
  FARMER = 'FARMER',
  BUYER = 'BUYER',
  DELIVERY = 'DELIVERY'
}

export enum OrderStatus {
  PENDING_FARMER = 'PENDING_FARMER',
  WAITING_DELIVERY = 'WAITING_DELIVERY',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  REJECTED = 'REJECTED'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  location: string;
  phone?: string;
  password?: string;
}

export interface Produce {
  id: string;
  farmerId: string;
  farmerName: string;
  name: string;
  category: string;
  quantity: number; // in kg
  pricePerKg: number;
  yieldDate: string;
  expireDate: string;
  location: string;
  description?: string;
  image?: string;
}

export interface Order {
  id: string;
  produceId: string;
  produceName: string;
  buyerId: string;
  buyerName: string;
  farmerId: string;
  deliveryId?: string;
  quantity: number;
  totalProducePrice: number;
  transportationCost: number;
  distance: number;
  pickupLocation: string;
  deliveryLocation: string;
  status: OrderStatus;
  createdAt: string;
}
