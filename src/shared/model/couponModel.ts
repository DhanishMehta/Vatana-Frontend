export interface Coupon {
  id: string;
  couponCode: string;
  startDate: Date;
  endDate: Date;
  redemption: number;
  isValid: boolean;
}