import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coupon } from 'src/shared/model/couponModel';
import { CommonReponse } from 'src/shared/model/reqResModel';
import { SERVER_API_BASE_URL } from 'src/shared/model/utility';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getHeader(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAllCoupons(): Observable<CommonReponse<Coupon[]>> {
    const token = this.authService.getToken();
    return this.http.get<CommonReponse<Coupon[]>>(
      SERVER_API_BASE_URL + `/coupons`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  getCouponById(couponId: string): Observable<CommonReponse<Coupon>> {
    const token = this.authService.getToken();
    return this.http.get<CommonReponse<Coupon>>(
      SERVER_API_BASE_URL + `/coupons/${couponId}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  postCoupon(coupon: Coupon): Observable<CommonReponse<Coupon>> {
    const token = this.authService.getToken();
    return this.http.post<CommonReponse<Coupon>>(
      SERVER_API_BASE_URL + `/coupons`,
      coupon,
      {
        headers: this.getHeader(token),
      }
    );
  }

  updateCoupon(coupon: Coupon): Observable<CommonReponse<Coupon>> {
    const token = this.authService.getToken();
    return this.http.put<CommonReponse<Coupon>>(
      SERVER_API_BASE_URL + `/coupons`,
      coupon,
      {
        headers: this.getHeader(token),
      }
    );
  }

  validateCoupon(couponCode: string): Observable<CommonReponse<Coupon>> {
    const token = this.authService.getToken();
    return this.http.get<CommonReponse<Coupon>>(
      SERVER_API_BASE_URL + `/coupons/validate/${couponCode}`,
      {
        headers: this.getHeader(token),
      }
    );
  }
}
