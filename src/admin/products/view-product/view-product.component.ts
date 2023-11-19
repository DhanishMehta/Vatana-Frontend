import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Product } from 'src/shared/model/productModel';
import { ProductService } from 'src/shared/services/product/product.service';

@Component({
  selector: 'admin-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss'],
})
export class ViewProductComponent implements OnInit, OnDestroy{
  productList: Product[] = [];
  subscriptions: Subscription[] = [];
  productListLength = 0;
  isLoading = true;

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
      width: '5%',
      name: '',
    },
    {
      width: '10%',
      name: 'Brand',
    },
    {
      width: '30%',
      name: 'Product',
    },
    {
      width: '20%',
      name: 'Category',
    },
    {
      width: '7.5%',
      name: 'Price',
    },
    {
      width: '7.5%',
      name: 'Rating',
    },
    {
      width: '10%',
      name: '',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
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

    const searchString = this.searchForm.controls['searchQuery'].value
      ? this.searchForm.controls['searchQuery'].value.length >= 3
        ? '/search?q=' + this.searchForm.controls['searchQuery'].value + '&'
        : '?'
      : '?';
    this.subscriptions.forEach((sub) => sub.unsubscribe);
    const sub = this.productService
      .getPaginatedProducts(
        searchString,
        this.pageEvent.pageIndex + 1,
        this.pageEvent.pageSize,
        '',
        ''
      )
      .subscribe({
        next: (res) => {
          this.productList = res.data.content;
          this.productListLength = res.data.totalElements;
          this.isLoading = false;
        },
      });
    this.subscriptions.push(sub);
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.handlePagination();
  }

  handleDeleteProduct(productId: string) {
    const sub = this.productService.deleteProduct(productId).subscribe({
      next: (res) => {
        this.snackBar.open('The Product is Deleted!', 'Ok', {
          duration: 4000,
        });
        this.handlePagination();
      },
    });
    this.subscriptions.push(sub);
  }
}
