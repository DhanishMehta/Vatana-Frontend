import { Address } from './userModel';

export interface Order {
  orderId?: string;
  userId: string;
  billingDetails: Billing;
  address: Address;
  paymentDetails: PaymentDetails;
  items: CheckoutItem[];
  pricing: CheckoutPrice;
  orderStatus: OrderStatus;
}

export type OrderStatus = "INITIALIZED" | "INPROGRESS"| "DELIVERED" ;

export interface Billing {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNo: string;
  companyName: string;
  companyAddress: string;
}

export interface PaymentDetails {
  paymentMethod: string;
  transactionId: string;
  success: boolean;
}

export interface CheckoutItem {
  productId?: string;
  productName: string;
  productImage: string;
  price: string;
  quantity: number;
}

export interface CheckoutPrice {
  orderTotal: number;
  discount: number;
  delivery: number;
  GST: number;
  grandTotal: number;
}

export interface OrderStatusMessage {
  status: string;
  message: string;
  description: Order
}
