import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { CategoryOfTree, Product } from 'src/shared/model/productModel';
import { ProductTabViewOptions } from 'src/shared/model/utility';
import { ProductService } from 'src/shared/services/product/product.service';

@Component({
  selector: 'user-product-tab',
  templateUrl: './product-tab.component.html',
  styleUrls: ['./product-tab.component.scss'],
})
export class ProductTabComponent implements OnInit, OnDestroy, AfterViewInit {
  productTabViewOptions!: ProductTabViewOptions;
  isLoading: boolean = true;
  subscriptions: Subscription[] = [];
  productsList: Product[] = [];
  categoryList: CategoryOfTree[] = [];

  selectedCategory = 0;
  selectedProduct: Product;
  selectedCategoryName = '';

  searchForm: FormGroup;
  filterForm: FormGroup;
  page: PageEvent = {
    pageIndex: 0,
    pageSize: 12,
    previousPageIndex: 0,
    length: 12,
  };
  paginatorShowingString = '';

  constructor(
    private productService: ProductService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.setViewOptions();
    // this.searchOnChange();

    this.initForms();

    this.populateCategoryList();
    // this.filterOnChange();
  }

  ngAfterViewInit(): void {
    const sub1 = this.searchForm.get('searchQuery').valueChanges.subscribe({
      next: (val) => {
        this.populateProductsList();
      },
      error: (er) => {
        console.error(er);
      },
    });

    this.subscriptions.push(sub1);

    const sub2 = this.filterForm.get('sortBy').valueChanges.subscribe({
      next: (val) => {
        this.populateProductsList();
      },
      error: (er) => {
        console.error(er);
      },
    });

    this.subscriptions.push(sub2);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  initForms() {
    this.searchForm = this.fb.group({
      searchQuery: this.fb.control(''),
    });

    this.filterForm = this.fb.group({
      sortBy: this.fb.control(''),
    });
  }

  populateProductsList() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.isLoading = true;
    const category = this.categoryList.find(
      (category) => category.id === this.selectedCategory
    );
    const sub = this.productService
      .getPaginatedProducts(
        `/search?q=${this.searchForm.controls['searchQuery'].value}&`,
        this.page.pageIndex + 1,
        this.page.pageSize,
        category?.slug!,
        this.filterForm.controls['sortBy'].value
      )
      .subscribe({
        next: (res) => {
          // populating product list
          this.productsList = res.data.content;

          // setting the initial value of selectedProduct for Modal.
          this.selectedProduct = this.productsList[0];

          this.isLoading = false;
        },
      });
    this.subscriptions.push(sub);
  }

  populateCategoryList() {
    this.isLoading = true;
    const sub = this.productService.getCategoryTree().subscribe({
      next: (res) => {
        this.categoryList = res.data;
        this.selectedCategory = this.categoryList[0].id;
        this.populateProductsList();
      },
    });

    this.subscriptions.push(sub);
  }

  handleCategoryChange(categoryId: number) {
    this.selectedCategory = categoryId;
    this.populateProductsList();
  }

  changeSelected(product: Product) {
    this.selectedProduct = product;
  }

  handlePageChange() {
    const startingIndex = this.page.pageIndex * this.page.pageSize + 1;
    const endingIndex = startingIndex + this.page.pageSize;
    this.paginatorShowingString = `Showing ${startingIndex}-${endingIndex} of ${this.page.length}`;
  }

  filterOnChange() {
    const sub = this.filterForm.valueChanges.subscribe({
      next: (data) => {
        this.populateProductsList();
      },
    });

    this.subscriptions.push(sub);
  }

  searchOnChange() {
    const sub = this.searchForm.valueChanges.subscribe({
      next: (val) => {
        this.populateProductsList();
      },
      error: (er) => {
        console.error(er);
      },
    });

    this.subscriptions.push(sub);
  }

  handleSearchQuery() {
    this.populateProductsList();
  }

  setViewOptions() {
    if (window.location.pathname === '/') {
      //home page
      this.productTabViewOptions = {
        sectionTitle: true,
        shopOptions: false,
        pagination: false,
        filterOptions: false,
      };
    } else {
      this.productTabViewOptions = {
        sectionTitle: false,
        shopOptions: true,
        pagination: true,
        filterOptions: true,
      };
    }
  }
}
