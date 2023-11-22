import { Component } from '@angular/core';
import { Cart } from 'src/shared/model/userModel';
import { AuthService } from 'src/shared/services/auth/auth.service';
import { CartService } from 'src/shared/services/cart/cart.service';
import { UserService } from 'src/shared/services/user/user.service';
import { OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl } from '@angular/forms';
import { CouponService } from 'src/shared/services/coupon/coupon.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'user-cart-area',
  templateUrl: './cart-area.component.html',
  styleUrls: ['./cart-area.component.scss'],
})
export class CartAreaComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  isLoading = true;
  cart!: Cart;
  displayCart = false;
  couponCode: FormControl;
  couponDiscount = 0;
  constructor(
    private cartService: CartService,
    private userService: UserService,
    private authService: AuthService,
    private couponService: CouponService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.couponCode = this.fb.control('');
    this.getCart();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /**
   * @function isLoggedIn: checks if the user is logged in
   * @returns boolean
   */
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  /**
   * @function getCart: function to get the cart of the logged in user
   */
  getCart(): void {
    if (this.authService.isLoggedIn()) {
      const sub = this.cartService.cart$.subscribe({
        next: (data) => {
          this.cart = data;
          this.displayCart = true;
          setTimeout(() => {
            this.isLoading = false;
          }, 1500);
        },
        error: (er) => {
          console.error(er);
        },
      });
      this.subscriptions.push(sub);
    }
  }

  /**
   * @function deleteFromCart: function to delete item from cart
   * @param productId 
   */
  deleteFromCart(productId: string): void {
    this.cartService.deleteFromCart(productId);
  }

  /**
   * @function addToCart: function to add product with productId to cart
   * @param productId 
   */
  addToCart(productId: string): void {
    this.cartService.addToCart(productId);
  }

  /**
   * @function removeEntireProduct: function to remove the entire product from cart
   * @param productId 
   */
  removeEntireProduct(productId: string): void {
    this.deleteFromCart(productId);
  }

  /**
   * @function displayTotal: utility function to find product of 2 numbers
   * @param qty 
   * @param itemPrice 
   * @returns product of the 2 input variables
   */
  displayTotal(qty: number, itemPrice: string): string {
    return (Number(qty) * Number(itemPrice)).toFixed(2);
  }

  /**
   * @function handleAddCouponCode: funciton to handle coupon code addition
   */
  handleAddCouponCode(): void {
    const couponCode = this.couponCode.value;
    this.couponService.validateCoupon(couponCode).subscribe({
      next: (res) => {
        if(res.success){
          this.couponDiscount += res.data.redemption;
          this.snackbar.open("Coupon added", "Yayy", {
            duration: 3000
          })
        } else {
          this.snackbar.open("Coupon invalid", "Try Later", {
            duration: 3000
          })
        }
      }
    })
  }
}
