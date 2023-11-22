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

  /**
   * @function getAllOrders: function to get all orders
   * @returns Orders Array
   */
  getAllOrders(): Observable<CommonReponse<Order[]>> {
    return this.http.get<CommonReponse<Order[]>>(SERVER_API_BASE_URL+'/orders');
  }

  /**
   * @function getOrderById: function to get an order by OrderId
   * @param orderId: id of order
   * @returns Order with orderId
   */
  getOrderById(orderId: string): Observable<CommonReponse<Order>> {
    return this.http.get<CommonReponse<Order>>(SERVER_API_BASE_URL+'/orders/'+orderId);
  }

  /**
   * @function postOrder: function to post a new order
   * @param newOrder : new order to be posted
   * @returns neworder addition response
   */
  postOrder(newOrder: Order): Observable<CommonReponse<Order>> {
    return this.http.post<CommonReponse<Order>>(SERVER_API_BASE_URL+'/orders', newOrder);
  }
  
  /**
   * @function getOrdersOfLoggedInUser: function to get orders of logged in user
   * @returns orders array of logged in user
   */
  getOrdersOfLoggedInUser() {
    const userId = this.authService.getUserId();
    return this.http.get<CommonReponse<Order[]>>(SERVER_API_BASE_URL+'/orders/user?id='+userId);
  }

}
