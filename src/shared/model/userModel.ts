import { InteractivityChecker } from "@angular/cdk/a11y";
import { Product } from "./productModel";
import { Order } from "./orderModel";

export interface User {
    userId?: string;
    userFirstName: string;
    userLastName: string;
    userPhone: string;
    userEmail: string;
    userEncryptedPassword: string;
    userSavedAddresses: Address[];
    userRole: UserRole;
    cart?: Cart;
    wishlist?: Product[];
    orderHistory?: Order[];
  }
  
  export interface Address {
    addressId?: string;
    addressLineOne: string;
    addressLineTwo: string;
    addressState: string;
    addressCity: string;
    addressPincode: string;
    addressLandmark: string;
    addressGeoHash?: string;
  }
  
  export interface Cart {
    cartItems: CartItem[];
    cartTotal: number;
  }
  
  export interface CartItem {
    cartItemProduct: Product;
    cartItemQuantity: number;
  }

  
export type UserRole = 'ADMIN' | 'USER' | 'DELIVERY_PARTNER' | 'STORE_MANAGER';