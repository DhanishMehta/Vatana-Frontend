import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review, SERVER_API_BASE_URL } from 'src/shared/model/utility';
import { CommonReponse } from 'src/shared/model/reqResModel';


@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) { }

  /**
   * @function getAllReviews: function to get all reviews
   * @returns 
   */
  getAllReviews(): Observable<CommonReponse<Review[]>> {
    return this.http.get<CommonReponse<Review[]>>(SERVER_API_BASE_URL + `/reviews`);
  }

  /**
   * @function getReviewByUserId: function to get reviews of a particular user
   * @param userId 
   * @returns 
   */
  getReviewByUserId(userId: string): Observable<CommonReponse<Review[]>> {
    return this.http.get<CommonReponse<Review[]>>(SERVER_API_BASE_URL + `/reviews?user=${userId}`);
  }

  /**
   * @function getReviewByProductId: funciton to get all reviews of a product
   * @param productId 
   * @returns 
   */
  getReviewByProductId(productId: string): Observable<CommonReponse<Review[]>> {  
    return this.http.get<CommonReponse<Review[]>>(SERVER_API_BASE_URL + `/reviews?product=${productId}`);
  }

  /**
   * @function getReviewById: function to get a particular review
   * @param reviewId 
   * @returns 
   */
  getReviewById(reviewId: string): Observable<CommonReponse<Review>> {
    return this.http.get<CommonReponse<Review>>(SERVER_API_BASE_URL + `/reviews/${reviewId}`);
  }

  /**
   * @function postReview: function to post a review
   * @param newReview 
   * @returns 
   */
  postReview(newReview: Review): Observable<CommonReponse<Review>> {
    return this.http.post<CommonReponse<Review>>(SERVER_API_BASE_URL + `/reviews`, newReview);
  }
}
