import { Component, OnInit } from '@angular/core';
import { Cart } from 'src/shared/model/userModel';
import { AuthService } from 'src/shared/services/auth/auth.service';
import { CartService } from 'src/shared/services/cart/cart.service';
import { UserService } from 'src/shared/services/user/user.service';
import { OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs'



@Component({
  selector: 'user-cart-menu',
  templateUrl: './cart-menu.component.html',
  styleUrls: ['./cart-menu.component.scss'],
})
export class CartMenuComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  cart!: Cart;
  displayCart: boolean = false;
  constructor(
    private cartService: CartService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getCart();
  }
  ngOnDestroy(): void {
      this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  isLoggedIn() :boolean {
    return this.authService.isLoggedIn();
  }

  getCart() {
    if (this.authService.isLoggedIn()) {
      const sub = this.cartService.cart$.subscribe({
        next: (data) => {
          this.cart = data;
          this.displayCart = true;
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
}
