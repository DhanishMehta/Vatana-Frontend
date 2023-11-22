import { Component } from '@angular/core';
import { Product } from 'src/shared/model/productModel';
import { AuthService } from 'src/shared/services/auth/auth.service';
import { CartService } from 'src/shared/services/cart/cart.service';
import { WishlistService } from 'src/shared/services/wishlist/wishlist.service';
import { OnInit, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs'



@Component({
  selector: 'user-wishlist-area',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistAreaComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  isLoading = true;
  wishlist: Product[] = [];
  displayCart = false;
  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getWishlist();
  }
  
  ngOnDestroy(): void {
      this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * @function isLoggedIn: function to check if the user is logged in
   * @returns boolean
   */
  isLoggedIn() :boolean {
    return this.authService.isLoggedIn();
  }

  /**
   * @function getWishlist: function to get the wishlist of the logged in user
   */
  getWishlist(): void {
    if (this.authService.isLoggedIn()) {
      this.isLoading = true;
      const sub = this.wishlistService.wishlist$.subscribe({
        next: (data) => {
          this.wishlist = data;
          this.displayCart = true;
          setTimeout(() => {
            this.isLoading = false;
          }, 1000);
        },
        error: (er) => {
          console.error(er);
        },
      });

      this.subscriptions.push(sub);
    }
  }

  /**
   * @function addToCart: function to add product to cart and remove from wishlist
   * @param productId 
   */
  addToCart(productId: string): void{
    this.wishlistService.deleteFromWishlist(productId);
    this.cartService.addToCart(productId);
    this.getWishlist();
  }
  
  /**
   * @function removeFromWishList: function to remove product from wishlist
   * @param productId 
   */
  removeFromWishList(productId: string): void{
    this.wishlistService.deleteFromWishlist(productId);
    this.getWishlist();
  }
}
