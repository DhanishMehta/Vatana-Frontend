import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/shared/model/productModel';
import { CartService } from 'src/shared/services/cart/cart.service';
import { ProductService } from 'src/shared/services/product/product.service';
import { WishlistService } from 'src/shared/services/wishlist/wishlist.service';
import { Subscription } from 'rxjs';
import { Review } from 'src/shared/model/utility';
import { ReviewService } from 'src/shared/services/review/review.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/shared/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'user-product-page-area',
  templateUrl: './product-page-area.component.html',
  styleUrls: ['./product-page-area.component.scss'],
})
export class ProductPageAreaComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  product!: Product;
  isLoading = true;
  relatedProducts: Product[] = [];
  reviewsList: Review[] = [];

  averageRating= '0';

  newRating = 0;

  reviewForm: FormGroup;

  constructor(
    private productService: ProductService,
    private activeRoute: ActivatedRoute,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private reviewService: ReviewService,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.populateProduct();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  initForm() {
    this.reviewForm = this.fb.group({
      title: this.fb.control('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(40),
      ]),
      message: this.fb.control('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(300),
      ]),
      name: this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
    });
  }

  populateProduct() {
    const sub = this.activeRoute.params.subscribe({
      next: (param) => {
        this.productService.getProductById(param['productId']).subscribe({
          next: (res) => {
            this.product = res.data;
            this.getReviews();
            this.getRelatedProducts();
          },
        });
      },
    });
    this.subscriptions.push(sub);
  }

  getRelatedProducts() {
    const sub = this.productService
      .getPaginatedProducts('', 1, 10, this.product.category.tlc_slug, '')
      .subscribe({
        next: (res) => {
          this.relatedProducts = res.data.content;
          this.isLoading = false;
        },
      });
    this.subscriptions.push(sub);
  }

  addToCart() {
    this.cartService.addToCart(this.product.id!);
  }

  addToWishlist() {
    this.wishlistService.addToWishlist(this.product.id!);
  }

  getReviews() {  
    const sub = this.reviewService.getReviewByProductId(this.product.id).subscribe({
      next: (res) => {
        this.reviewsList = res.data;
        this.getAverageRating();
      }, error: (er) => {
        console.error(er);
      }
    });
    this.subscriptions.push(sub);
  }

  handleAddReviews() {
    const formValue = this.reviewForm.value;
    let newReview: Review = {
      productId: this.product.id,
      userId: this.authService.getUserId(),
      userName: formValue.name,
      reviewMessage: formValue.message,
      reviewTitle: formValue.title,
      reviewRating: this.newRating,
      reviewTime: new Date(),
    };
    this.reviewService.postReview(newReview).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.open('Review Added', 'Yayy!', {
            duration: 3000,
          });
          this.reviewForm.reset();
          this.getReviews();
        } else {
          this.snackBar.open('Review Failed', 'Try Later!', {
            duration: 3000,
          });
        }
      },
      error: (er) => {
        console.error(er);
      },
    });
  }

  getRating(val) {
    this.newRating = Number(val);
  }

  getAverageRating() {
    let sum = 0;
    this.reviewsList.forEach(review => {
      sum += review.reviewRating;
    })
    this.averageRating = (sum / this.reviewsList.length).toFixed(2);
  }
}
