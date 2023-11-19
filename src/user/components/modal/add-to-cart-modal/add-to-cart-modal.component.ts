import { Component, Input } from '@angular/core';
import { Product } from 'src/shared/model/productModel';

@Component({
  selector: 'user-add-to-cart-modal',
  templateUrl: './add-to-cart-modal.component.html',
  styleUrls: ['./add-to-cart-modal.component.scss']
})
export class AddToCartModalComponent {
  @Input() product!: Product;
}
