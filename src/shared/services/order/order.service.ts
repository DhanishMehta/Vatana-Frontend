import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from 'src/shared/model/orderModel';
import { CommonReponse } from 'src/shared/model/reqResModel';
import { SERVER_API_BASE_URL } from 'src/shared/model/utility';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllOrders(): Observable<CommonReponse<Order[]>> {
    return this.http.get<CommonReponse<Order[]>>(SERVER_API_BASE_URL+'/orders');
  }

  getOrderById(orderId: string): Observable<CommonReponse<Order>> {
    return this.http.get<CommonReponse<Order>>(SERVER_API_BASE_URL+'/orders/'+orderId);
  }

  postOrder(newOrder: Order): Observable<CommonReponse<Order>> {
    return this.http.post<CommonReponse<Order>>(SERVER_API_BASE_URL+'/orders', newOrder);
  }
  
  getOrdersOfLoggedInUser() {
    const userId = this.authService.getUserId();
    return this.http.get<CommonReponse<Order[]>>(SERVER_API_BASE_URL+'/orders/user?id='+userId);
  }

}
