import { Component, Input } from '@angular/core';
import { Product } from 'src/shared/model/productModel';

@Component({
  selector: 'user-wishlist-modal',
  templateUrl: './wishlist-modal.component.html',
  styleUrls: ['./wishlist-modal.component.scss']
})
export class WishlistModalComponent {
  @Input() product!: Product;

}
