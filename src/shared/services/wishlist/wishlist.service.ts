import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from 'src/shared/model/productModel';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { CommonReponse } from 'src/shared/model/reqResModel';
import { User } from 'src/shared/model/userModel';
import { SERVER_API_BASE_URL } from 'src/shared/model/utility';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService implements OnDestroy {
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /**
   * @function getHeader: function to get HttpHeader with authorization
   * @param token 
   * @returns 
   */
  getHeader(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  /**
   * @function getUserById: function to get the userId of logged in user
   * @returns userID of logged in user
   */
  getUserId() {
    return this.authService.getUserId();
  }

  /**
   * @function getWishlist: function to get the wishlist of the logged in user
   */
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

  /**
   * @function addToWishlist: function to add a product to the wishlist
   * @param productId 
   */
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
          this.initialwishlist = res.data.wishlist;
          this.wishlist.next(this.initialwishlist);
        },
        error: (er) => {
          console.error(er);
        },
      });

    this.subscriptions.push(sub);
  }

  /**
   * @function deleteFromWishlist: function to delete a product from the wishlist
   * @param productId 
   */
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
          this.initialwishlist = res.data.wishlist;
          this.wishlist.next(this.initialwishlist);
        },
        error: (er) => {
          console.error(er);
        },
      });

    this.subscriptions.push(sub);
  }
}
