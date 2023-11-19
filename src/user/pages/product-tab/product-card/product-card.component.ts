import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from 'src/shared/model/productModel';
import { CartService } from 'src/shared/services/cart/cart.service';
import { WishlistService } from 'src/shared/services/wishlist/wishlist.service';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
  @Output() eventEmitter: EventEmitter<Product> = new EventEmitter();
  constructor(private cartService: CartService, private wishlistService: WishlistService) {}

  ngOnInit(): void {
      
  }

  handleEmit() {
    this.eventEmitter.emit(this.product);
  }

  addToCart(){
    this.cartService.addToCart(this.product.id!);
    this.handleEmit();
  }
  addToWishlist(){
    this.wishlistService.addToWishlist(this.product.id!);
    this.handleEmit();
    
  }
  quickView(){
    this.handleEmit();
  }
}
