import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Cart, User } from 'src/shared/model/userModel';
import { UserService } from '../user/user.service';
import { BehaviorSubject, of } from 'rxjs';
import { CommonReponse } from 'src/shared/model/reqResModel';
import { SERVER_API_BASE_URL } from 'src/shared/model/utility';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  initialCart: Cart = {
    cartItems: [],
    cartTotal: 0,
  };
  cart: BehaviorSubject<Cart> = new BehaviorSubject(this.initialCart);
  cart$ = this.cart.asObservable();
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService
  ) {
    if (this.authService.isLoggedIn()) {
      this.getCart();
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  getHeader(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getUserId() {
    return this.authService.getUserId()!;
  }

  getCart() {
    const userId = this.getUserId();
    if (userId !== null) {
      const sub = this.userService.getUserById(userId).subscribe({
        next: (res) => {
          if (res.data.cart !== null && res.data.cart)
            this.initialCart = res.data.cart;
          else
            this.initialCart = {
              cartItems: [],
              cartTotal: 0,
            };
          this.cart.next(this.initialCart);
        },
        error: (er) => {
          console.error(er);
        },
      });
      this.subscriptions.push(sub);
    }
  }

  addToCart(productId: string) {
    const userId = this.getUserId();
    const token = this.authService.getToken();
    const sub = this.http
      .post<CommonReponse<User>>(
        SERVER_API_BASE_URL + `/cart`,
        {
          productId: productId,
          userId: userId,
        },
        { headers: this.getHeader(token ?? '') }
      )
      .subscribe({
        next: (res) => {
          this.initialCart = res.data.cart!;
          this.cart.next(this.initialCart);
        },
        error: (er) => {
          console.error(er);
        },
      });

    this.subscriptions.push(sub);
  }

  deleteFromCart(productId: string) {
    const userId = this.getUserId();
    const token = this.authService.getToken();
    const sub = this.http
      .delete<CommonReponse<User>>(
        SERVER_API_BASE_URL + `/cart/${productId}/${userId}`,
        { headers: this.getHeader(token ?? '') }
      )
      .subscribe({
        next: (res) => {
          this.initialCart = res.data.cart!;
          this.cart.next(this.initialCart);
        },
        error: (er) => {
          console.error(er);
        },
      });

    this.subscriptions.push(sub);
  }

  clearCart() {
    const userId = this.getUserId();
    const token = this.authService.getToken();
    const sub = this.http
      .put<CommonReponse<User>>(
        SERVER_API_BASE_URL + '/cart/clear?user=' + userId,
        null,
        { headers: this.getHeader(token ?? '') }
      )
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.initialCart = {
              cartItems: [],
              cartTotal: 0,
            };
            this.cart.next(this.initialCart);
          } else {
            console.error('Failed to clear cart!');
          }
        },
        error: (er) => {
          console.error(er);
        },
      });
  }
}
