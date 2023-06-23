import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryPagination, ICategory } from '../_models/category';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { IPagination } from '../_models/pagination';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  baseUrl = environment.apiUrl;
  categories: ICategory[] = [];
  pagination = new CategoryPagination();
  constructor(private http: HttpClient) {}

  getCategoriesFromRemote(pageIndex?: number, pageSize?: number) {
    let params = new HttpParams();

    if (pageIndex && pageSize) {
      params = params.append('pageIndex', pageIndex);
      params = params.append('pageSize', pageSize);
    }

    return this.http
      .get<IPagination<ICategory>>(this.baseUrl + 'Category', {
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

  addCategoryRemote(model: ICategory) {
    return this.http.post(this.baseUrl + 'Category/add-category', model).pipe(
      map((response: ICategory) => {
        this.categories.push(response);
        return response;
      })
    );
  }

  updateCategoryRemote(model: ICategory) {
    return this.http.post(this.baseUrl + 'Category/update-category', model).pipe(
      map((response: ICategory) => {
        this.categories.push(response);
        return response;
      })
    );
  }
}
