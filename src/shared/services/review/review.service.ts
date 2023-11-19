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

  getAllReviews(): Observable<CommonReponse<Review[]>> {
    return this.http.get<CommonReponse<Review[]>>(SERVER_API_BASE_URL + `/reviews`);
  }

  getReviewByUserId(userId: string): Observable<CommonReponse<Review[]>> {
    return this.http.get<CommonReponse<Review[]>>(SERVER_API_BASE_URL + `/reviews?user=${userId}`);
  }

  getReviewByProductId(productId: string): Observable<CommonReponse<Review[]>> {  
    return this.http.get<CommonReponse<Review[]>>(SERVER_API_BASE_URL + `/reviews?product=${productId}`);
  }

  getReviewById(reviewId: string): Observable<CommonReponse<Review>> {
    return this.http.get<CommonReponse<Review>>(SERVER_API_BASE_URL + `/reviews/${reviewId}`);
  }

  postReview(newReview: Review): Observable<CommonReponse<Review>> {
    return this.http.post<CommonReponse<Review>>(SERVER_API_BASE_URL + `/reviews`, newReview);
  }
}
