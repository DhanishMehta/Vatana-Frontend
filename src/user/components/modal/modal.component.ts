import { Component, Input } from '@angular/core';
import { Product } from 'src/shared/model/productModel';

@Component({
  selector: 'user-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() product!: Product;
}
