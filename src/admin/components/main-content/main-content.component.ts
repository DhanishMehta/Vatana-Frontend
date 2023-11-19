import { Component, OnInit, OnDestroy } from '@angular/core';
import { Card } from './card/card.component';
import { UserService } from 'src/shared/services/user/user.service';
import { ProductService } from 'src/shared/services/product/product.service';
import {Subscription} from 'rxjs'
import { OrderService } from 'src/shared/services/order/order.service';
import { Order } from 'src/shared/model/orderModel';

@Component({
  selector: 'admin-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'],
})
export class MainContentComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  isLoading = true;
  isLoading1 = true;
  isLoading2 = true;
  isLoading3 = true;
  userListLength = 0;
  productListLength = 0;
  orderListLength = 0;
  totalEarnings = 0;
  adminCard: Card[] = [];

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const sub1 = this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.userListLength = res.data.length;
        this.populateAdminCards();
        this.isLoading1 = false;
        this.isLoading = this.isLoading1 || this.isLoading2 || this.isLoading3;
      },
    });
    this.subscriptions.push(sub1);
    const sub2 = this.productService.getPaginatedProducts('?', 1, 1, '', '').subscribe({
      next: (res) => {
        this.productListLength = res.data.totalElements;
        this.populateAdminCards();
        this.isLoading2 = false;
        this.isLoading = this.isLoading1 || this.isLoading2 || this.isLoading3;
      },
    });
    
    const sub3 = this.orderService.getAllOrders().subscribe({
      next: (res) => {
        this.orderListLength = res.data.length;
        this.calculateTotalEarnings(res.data);
        this.isLoading3 = false;
        this.isLoading = this.isLoading1 || this.isLoading2 || this.isLoading3;
      }
    })
    this.subscriptions.push(sub2);
  }

  ngOnDestroy(): void {
      this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  calculateTotalEarnings(orderList: Order[]){
    orderList.forEach(order => {
      this.totalEarnings += order.pricing.grandTotal;
    })
  }

  populateAdminCards() {
    this.adminCard = [
      {
        title: 'Users',
        description: ''+this.userListLength,
        color: 'success',
        icon: "bi-person",
        routerLink: "users"
      },
      {
        title: 'Products',
        description: ''+this.productListLength,
        color: 'primary',
        icon: "bi-cart",
        routerLink: "products"
      },
      {
        title: 'Orders',
        description: ''+this.orderListLength,
        color: 'danger',
        icon: "bi-cart4",
        routerLink: "orders"
      },
      {
        title: 'Earnings',
        description: '₹ '+(this.totalEarnings / 1000).toFixed(2) + 'K' ,
        color: 'warning',
        icon: "bi-cash-stack",
        routerLink: ""
      },
    ];
  }
}
