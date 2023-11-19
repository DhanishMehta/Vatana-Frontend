import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Order, OrderStatusMessage } from 'src/shared/model/orderModel';
import { AuthService } from 'src/shared/services/auth/auth.service';
import { OrderService } from 'src/shared/services/order/order.service';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss'],
})
export class OrderStatusComponent implements OnInit, OnDestroy {
  isLoading = true;
  subscriptions: Subscription[] = [];
  orderStatus: OrderStatusMessage;

  constructor(private orderService: OrderService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.getOrderStatus();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  getOrderStatus() {
    let status = window.location.pathname;
    status = status.slice(7);
    status = status.slice(0,1).toUpperCase() + status.slice(1,);
    let orderId = window.location.search;
    orderId = orderId.slice(4);

    const sub = this.orderService.getOrderById(orderId).subscribe({
      next: (res) => {
        if (!res.success) {
          this.router.navigate(['/404']);
        }
        if(res.data.userId !== this.authService.getUserId()) {
          this.router.navigate(['/403']);
        }
        this.orderStatus = {
          status: status,
          message: "",
          description: res.data,
        }
        if(status === 'Success') {
          this.orderStatus.message = "Your order has been placed !" 
        } else {
          this.orderStatus.message = "You payment has failed! Don't worry, your order has been placed! Pay now to avoid cancellation." 
        }
          this.isLoading = false;
      },
      error: (er) => {
        console.error(er);
      },
    });
    this.subscriptions.push(sub);
  }

  getTotalPriceOfProduct(price: string, quantity: number) {
    return (Number(price) * quantity).toFixed(2).toString();
  }
}
