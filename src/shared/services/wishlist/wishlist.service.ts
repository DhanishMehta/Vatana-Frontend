import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from 'src/shared/model/productModel';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { CommonReponse } from 'src/shared/model/reqResModel';
import { User } from 'src/shared/model/userModel';
import { SERVER_API_BASE_URL } from 'src/shared/model/utility';
import { OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  initialwishlist: Product[] = [];
  wishlist: BehaviorSubject<Product[]> = new BehaviorSubject(
    this.initialwishlist
  );
  wishlist$ = this.wishlist.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService
  ) {
    if (this.authService.isLoggedIn()) {
      this.getWishlist();
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

  getWishlist() {
    const userId = this.getUserId();
    if (userId !== null) {
      const sub = this.userService.getUserById(userId).subscribe({
        next: (res) => {
          if (res.data.wishlist !== null && res.data.wishlist)
            this.initialwishlist = res.data.wishlist;
          else this.initialwishlist = [];
          this.wishlist.next(this.initialwishlist);
        },
        error: (er) => {
          console.error(er);
        },
      });

      this.subscriptions.push(sub);
    }
  }

  addToWishlist(productId: string) {
    const userId = this.getUserId();
    const token = this.authService.getToken();
    const sub = this.http
      .post<CommonReponse<User>>(
        SERVER_API_BASE_URL + `/wishlist`,
        {
          productId: productId,
          userId: userId,
        },
        { headers: this.getHeader(token ?? '') }
      )
      .subscribe({
        next: (res) => {
          this.initialwishlist = res.data.wishlist!;
          this.wishlist.next(this.initialwishlist);
        },
        error: (er) => {
          console.error(er);
        },
      });

    this.subscriptions.push(sub);
  }

  deleteFromWishlist(productId: string) {
    const userId = this.getUserId();
    const token = this.authService.getToken();
    const sub = this.http
      .delete<CommonReponse<User>>(
        SERVER_API_BASE_URL + `/wishlist/${productId}/${userId}`,
        { headers: this.getHeader(token ?? '') }
      )
      .subscribe({
        next: (res) => {
          this.initialwishlist = res.data.wishlist!;
          this.wishlist.next(this.initialwishlist);
        },
        error: (er) => {
          console.error(er);
        },
      });

    this.subscriptions.push(sub);
  }
}
