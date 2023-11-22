import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  /**
   * @function getAllProducts: function to get all products
   * @param additionalString 
   * @returns 
   */
  getAllProducts(additionalString: string): Observable<CommonReponse<Page<Product[]>>> {
    return this.http.get<CommonReponse<Page<Product[]>>>(SERVER_API_BASE_URL + '/products'+additionalString);
  }

  /**
   * @function: function to get product by productId
   * @param productId 
   * @returns 
   */
  getProductById(productId: string): Observable<CommonReponse<Product>> {
    return this.http.get<CommonReponse<Product>>(SERVER_API_BASE_URL + '/products/'+productId);
  }

  /**
   * @function getPaginatedProducts: function to get products is pageable format with additional parameters like page, limit, category, soryBy
   * @param additionalString 
   * @param page 
   * @param limit 
   * @param category 
   * @param sortBy 
   * @returns 
   */
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

  /**
   * @function updateProduct: funciton to update a product
   * @param product 
   * @param productId 
   * @returns 
   */
  updateProduct(product: Product, productId: string): Observable<CommonReponse<Product>> {
    return this.http.put<CommonReponse<Product>>(
      SERVER_API_BASE_URL + '/products/' + productId,
      product
    );
  }

  /**
   * @function deleteProduct: function to delete a product
   * @param productId 
   * @returns 
   */
  deleteProduct(productId: string): Observable<CommonReponse<Product>> {
    return this.http.delete<CommonReponse<Product>>(
      SERVER_API_BASE_URL + '/products/' + productId
    );
  }

  /**
   * @function addProduct: function to add a product
   * @param product 
   * @returns 
   */
  addProduct(product: Product): Observable<CommonReponse<Product>> {
    return this.http.post<CommonReponse<Product>>(SERVER_API_BASE_URL + '/products', product);
  }

  /**
   * @function getCategoryTree: function to get the category tree
   * @returns 
   */
  getCategoryTree(): Observable<CommonReponse<CategoryOfTree[]>> {
    return this.http.get<CommonReponse<CategoryOfTree[]>>(SERVER_API_BASE_URL + "/category/tree",
      {headers: new HttpHeaders({'Access-Control-Allow-Origin':'*'})}
    );
  }

  /**
   * @function getCategoryById: function to get a specific category by categoryId
   * @param categoryId 
   * @returns 
   */
  getCategoryById(categoryId: string): Observable<CommonReponse<CategoryOfTree>> {
    return this.http.get<CommonReponse<CategoryOfTree>>(SERVER_API_BASE_URL + "/category/" + categoryId);
  }
}
