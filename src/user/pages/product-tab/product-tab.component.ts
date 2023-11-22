import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
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
  isLoading = true;
  subscriptions: Subscription[] = [];
  productsList: Product[] = [];
  categoryList: CategoryOfTree[] = [];

  selectedCategory = 0;
  selectedProduct: Product;
  selectedCategoryName = '';

  searchForm: FormGroup;
  sortBy: FormControl;
  filterForm: FormGroup;
  noOfPages = 0;
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
      next: () => {
        this.populateProductsList();
      },
      error: (er) => {
        console.error(er);
      },
    });

    this.subscriptions.push(sub1);

    const sub2 = this.filterForm.get('sortBy').valueChanges.subscribe({
      next: () => {
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

  /**
   * @function initForms: function to initialze the forms
   */
  initForms(): void {
    this.sortBy = this.fb.control('');

    this.searchForm = this.fb.group({
      searchQuery: this.fb.control(''),
    });

    this.filterForm = this.fb.group({
      sortBy: this.fb.control(''),
    });
  }

  /**
   * @function populateProductsList: function to populate the products list
   */
  populateProductsList(): void {
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
        category.slug,
        this.sortBy.value
        // this.filterForm.controls['sortBy'].value
      )
      .subscribe({
        next: (res) => {
          // populating product list
          this.productsList = res.data.content;
          // setting the initial value of selectedProduct for Modal.
          this.selectedProduct = this.productsList[0];
          this.page.length = res.data.totalElements;

          this.updatePaginatorString();
          this.isLoading = false;
        },
      });
    this.subscriptions.push(sub);
  }

  /**
   * @function populateCategoryList: functio to get the product category list
   */
  populateCategoryList(): void {
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

  /**
   * @function handleCategoryChange: function to handle the category change
   * @param categoryId 
   */
  handleCategoryChange(categoryId: number): void {
    this.selectedCategory = categoryId;
    this.populateProductsList();
  }

  /**
   * @function changeSelected: function to change the selectedProduct to the current selection
   * @param product 
   */
  changeSelected(product: Product): void {
    this.selectedProduct = product;
  }

  /**
   * @function handlePageChange: function to handle page change during pagination
   * @param page 
   */
  handlePageChange(page: PageEvent) {
    this.page = page;
    this.populateProductsList();
  }
  
  /**
   * @function updatePaginatorString: function to update the pagination "showing xx products" string
   */
  updatePaginatorString(): void {
    const startingIndex = this.page.pageIndex * this.page.pageSize + 1;
    const endingIndex = startingIndex + this.page.pageSize - 1;
    this.paginatorShowingString = `Showing ${startingIndex}-${endingIndex} of ${this.page.length}`;
  }

  /**
   * @function filterOnChange: function to subscribe to the filter change values
   */
  filterOnChange(): void {
    // const sub = this.filterForm.valueChanges.subscribe({
    //   next: (val) => {
    //     console.log(val);
    //     this.populateProductsList();
    //   },
    // });

    const sub = this.sortBy.valueChanges.subscribe({
      next: (val) => {
        console.log(val);
        this.populateProductsList();
      },
    });

    this.subscriptions.push(sub);
  }

  /**
   * @function searchOnChange: function to subscribe to the search form value changes
   */
  searchOnChange(): void {
    const sub = this.searchForm.valueChanges.subscribe({
      next: () => {
        this.populateProductsList();
      },
      error: (er) => {
        console.error(er);
      },
    });

    this.subscriptions.push(sub);
  }

  /**
   * @function handleSearchQuery: function to handle the search query changes
   */
  handleSearchQuery(): void {
    this.populateProductsList();
  }

  /**
   * @function setViewOptions: function to set the page view options based on the current page
   */
  setViewOptions(): void {
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
