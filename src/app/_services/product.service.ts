import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IProduct, ProductPagination } from '../_models/product';
import { IPagination } from '../_models/pagination';
import { map } from 'rxjs';
import { ProductParams } from '../_models/productParams';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseUrl = environment.apiUrl;
  products: IProduct[] = [];
  pagination = new ProductPagination();
  productParams = new ProductParams();
  constructor(private http: HttpClient) { }

  setProductParams(params: ProductParams) {
    this.productParams = params;
  }

  getProductParams() {
    return this.productParams;
  }

  getProductsFromRemote() {
    let params = new HttpParams();

    if (this.productParams.categoryId !== 0) {
      params = params.append('categoryId', this.productParams.categoryId.toString())
    }

      params = params.append('pageIndex', this.productParams.pageNumber.toString());
      params = params.append('pageSize', this.productParams.pageSize.toString());

    return this.http
      .get<IPagination<IProduct>>(this.baseUrl + 'Tests', {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          this.pagination = response.body;
          return this.pagination;
        })
      );
  }

  addProductRemote(model: IProduct) {
    return this.http.post(this.baseUrl + 'Tests/add-product', model).pipe(
      map((response: IProduct) => {
        this.products.push(response);
        return response;
      })
    );
  }

  updateProductRemote(model: IProduct) {
    return this.http.post(this.baseUrl + 'Tests/update-product', model).pipe(
      map((response: IProduct) => {
        this.products.push(response);
        return response;
      })
    );
  }

}
