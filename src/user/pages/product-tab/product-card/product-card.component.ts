import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from 'src/shared/model/productModel';
import { CartService } from 'src/shared/services/cart/cart.service';
import { WishlistService } from 'src/shared/services/wishlist/wishlist.service';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() eventEmitter: EventEmitter<Product> = new EventEmitter();
  constructor(private cartService: CartService, private wishlistService: WishlistService) {}

  /**
   * @function handleEmit: function to emit the product values
   */
  handleEmit(): void {
    this.eventEmitter.emit(this.product);
  }

  /**
   * @function addToCart: function to add product to cart
   */
  addToCart(): void{
    this.cartService.addToCart(this.product.id);
    this.handleEmit();
  }

  /**
   * @function addToWishlist: function to add product to wishlist
   */
  addToWishlist(): void{
    this.wishlistService.addToWishlist(this.product.id);
    this.handleEmit();
  }

  /**
   * @function quickView: function to handle the quick view modal
   */
  quickView(): void{
    this.handleEmit();
  }
}
