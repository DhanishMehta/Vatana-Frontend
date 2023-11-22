import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  /**
   * @function getHeader: function to get HTTPHeader with Authorization
   * @param token: JWT token of the current user
   * @returns HTTPHeader with Authorization Bearer JWT token key value pair
   */
  getHeader(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  /**
   * @function getAllCoupons: function to get allcoupons
   * @returns All coupons
   */
  getAllCoupons(): Observable<CommonReponse<Coupon[]>> {
    const token = this.authService.getToken();
    return this.http.get<CommonReponse<Coupon[]>>(
      SERVER_API_BASE_URL + `/coupons`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  /**
   * @function getCouponById: function to get a coupon by coupon id
   * @param couponId 
   * @returns  coupon
   */
  getCouponById(couponId: string): Observable<CommonReponse<Coupon>> {
    const token = this.authService.getToken();
    return this.http.get<CommonReponse<Coupon>>(
      SERVER_API_BASE_URL + `/coupons/${couponId}`,
      {
        headers: this.getHeader(token),
      }
    );
  }

  /**
   * @function postCoupon: function to add a coupon to the database
   * @param coupon : new coupon to be added
   * @returns response of coupon addition
   */
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

  /**
   * @function updateCoupon: function to update a coupon to the database
   * @param coupon : coupon to be updaetd
   * @returns response of coupon updation
   */
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

  /**
   * @function validateCoupon: function to validate a coupon
   * @param couponCode code of coupon (string) to be validated
   * @returns whether a coupon with couponCode is valid or not
   */
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
