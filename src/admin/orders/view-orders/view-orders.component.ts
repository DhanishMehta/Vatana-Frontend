import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Order } from 'src/shared/model/orderModel';
import { OrderService } from 'src/shared/services/order/order.service';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.scss']
})
export class ViewOrdersComponent implements OnInit, OnDestroy {
  isLoading = true;
  subscriptions: Subscription[] = [];
  orderList: Order[] = [];

  searchForm: FormGroup = new FormGroup({});
  pageEvent: PageEvent = {
    length: 10,
    pageIndex: 0,
    pageSize: 10,
    previousPageIndex: 0,
  };
  sortIcon = '';
  sortState = 'unsorted';
  displayedColumns = [
    {
      width: '25%',
      name: 'Order ID',
    },
    {
      width: '15%',
      name: 'Buyer Name',
    },
    {
      width: '20%',
      name: 'Billing Address',
    },
    {
      width: '15%',
      name: 'Payment Method',
    },
    {
      width: '15%',
      name: 'Amount',
    },
    {
      width: '15%',
      name: 'Status',
    }
  ];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.handlePagination();
    this.searchForm.valueChanges.subscribe({
      next: (value) => {
        this.handlePagination();
      },
    });
  }

  ngOnDestroy(): void {
      this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  initForm() {
    this.searchForm = this.fb.group({
      searchQuery: this.fb.control(''),
    });
  }

  handlePagination() {
    this.isLoading = true;
    this.subscriptions.forEach((sub) => sub.unsubscribe);
    const sub = this.orderService
      .getAllOrders()
      .subscribe({
        next: (res) => {
          this.orderList = res.data;
          this.isLoading = false;
        },
      });
    this.subscriptions.push(sub);
  }
}
