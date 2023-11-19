import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { CategoryOfTree, Product } from 'src/shared/model/productModel';
import { CommonReponse } from 'src/shared/model/reqResModel';
import { Page, SERVER_API_BASE_URL } from 'src/shared/model/utility';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getAllProducts(additionalString: string): Observable<CommonReponse<Page<Product[]>>> {
    return this.http.get<CommonReponse<Page<Product[]>>>(SERVER_API_BASE_URL + '/products'+additionalString);
  }

  getProductById(productId: string): Observable<CommonReponse<Product>> {
    return this.http.get<CommonReponse<Product>>(SERVER_API_BASE_URL + '/products/'+productId);
  }

  getPaginatedProducts(additionalString:string, page: number, limit: number, category: string, sortBy: string): Observable<CommonReponse<Page<Product[]>>> {
    additionalString = additionalString === '' ? '?' : additionalString;
    
    let customURL = '/products'+additionalString;
    if(page !== null) customURL += "page=" + page;
    if(limit !== null) customURL += "&limit=" + limit;
    if(category !== null && category !== '' && category) customURL += "&category=" + category;
    if(sortBy !== null && sortBy !== '' && sortBy) customURL += "&sortBy=" + sortBy;
    
    return this.http.get<CommonReponse<Page<Product[]>>>(
      SERVER_API_BASE_URL + customURL
    );
  }

  updateProduct(product: Product, productId: string): Observable<CommonReponse<Product>> {
    return this.http.put<CommonReponse<Product>>(
      SERVER_API_BASE_URL + '/products/' + productId,
      product
    );
  }

  deleteProduct(productId: string): Observable<CommonReponse<Product>> {
    return this.http.delete<CommonReponse<Product>>(
      SERVER_API_BASE_URL + '/products/' + productId
    );
  }

  addProduct(product: Product): Observable<CommonReponse<Product>> {
    return this.http.post<CommonReponse<Product>>(SERVER_API_BASE_URL + '/products', product);
  }

  getCategoryTree(): Observable<CommonReponse<CategoryOfTree[]>> {
    return this.http.get<CommonReponse<CategoryOfTree[]>>(SERVER_API_BASE_URL + "/category/tree");
  }

  getCategoryById(categoryId: String): Observable<CommonReponse<CategoryOfTree>> {
    return this.http.get<CommonReponse<CategoryOfTree>>(SERVER_API_BASE_URL + "/category/" + categoryId);
  }
}
