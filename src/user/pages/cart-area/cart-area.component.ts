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
  displayCart: boolean = false;
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

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getCart() {
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

  deleteFromCart(productId: string) {
    this.cartService.deleteFromCart(productId);
  }

  addToCart(productId: string) {
    this.cartService.addToCart(productId);
  }

  removeEntireProduct(productId: string) {}

  displayTotal(qty: number, itemPrice: string) {
    return (Number(qty) * Number(itemPrice)).toFixed(2);
  }

  handleAddCouponCode() {
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
