import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/shared/services/auth/auth.service';
import { CartService } from 'src/shared/services/cart/cart.service';
import { WishlistService } from 'src/shared/services/wishlist/wishlist.service';
import {  OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs'

@Component({
  selector: 'user-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  totalCartItems = '';
  totalWishlistItems = '';
  constructor(private authService: AuthService, private cartService: CartService, private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.getCartItemsCount();
    this.getWishListItemsCount();
  }

  ngOnDestroy(): void {
      this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  isLoggedIn() {
    return this.authService.isLoggedIn()
  }

  isAdmin() {
    return this.isLoggedIn() && this.authService.getRole() === "ADMIN";
  }

  getCartItemsCount() {
    const sub = this.cartService.cart$.subscribe({
      next: (res) => {
        this.totalCartItems = res.cartItems.length.toString();
        if(this.totalCartItems === '0')
          this.totalCartItems = '';
      }
    })
    this.subscriptions.push(sub);
  }

  getWishListItemsCount() {
    const sub = this.wishlistService.wishlist$.subscribe({
      next: (res) => {
        this.totalWishlistItems = res.length.toString();
        if(this.totalWishlistItems === '0')
          this.totalWishlistItems = '';
      },
      error: (er) => {
        console.error(er);
      }
    });

    this.subscriptions.push(sub);
  }
}
