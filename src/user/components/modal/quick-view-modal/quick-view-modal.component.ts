import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/shared/model/productModel';
import { CartItem } from 'src/shared/model/userModel';
import { CartService } from 'src/shared/services/cart/cart.service';
import { WishlistService } from 'src/shared/services/wishlist/wishlist.service';
import { OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs'



@Component({
  selector: 'user-quick-view-modal',
  templateUrl: './quick-view-modal.component.html',
  styleUrls: ['./quick-view-modal.component.scss'],
})
export class QuickViewModalComponent implements OnInit, OnDestroy {
  @Input() product!: Product;
  subscriptions: Subscription[] = [];
  isAddedToCart = false;
  constructor(private cartService: CartService, private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.checkIsAddedToCart();
  }

  ngOnDestroy(): void {
      this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  checkIsAddedToCart() {
    const sub = this.cartService.cart$.subscribe({
      next: (res) => {
        const index = res.cartItems.findIndex(
          (item: CartItem) => item.cartItemProduct === this.product
        );
        if (index !== -1) this.isAddedToCart = true;
        else this.isAddedToCart = false;
      },
    });
    this.subscriptions.push(sub);
  }

  addToCart() {
    this.cartService.addToCart(this.product.id);
  }

  addToWishlist() {
    this.wishlistService.addToWishlist(this.product.id);
  }
}
