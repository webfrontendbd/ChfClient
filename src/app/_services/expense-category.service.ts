import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ExpenseCategoryPagination, IExpenseCategory } from '../_models/expenseCategory';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPagination } from '../_models/pagination';
import { map } from 'rxjs';
import { EntityParams } from '../_models/entityParams';

@Injectable({
  providedIn: 'root'
})
export class ExpenseCategoryService {
  baseUrl = environment.apiUrl;
  categories: IExpenseCategory[] = [];
  categoryParams = new EntityParams();
  pagination = new ExpenseCategoryPagination();
  constructor(private http: HttpClient) {}

  setCategoryParams(params: EntityParams) {
    this.categoryParams = params;
  }

  getCategoryParams() {
    return this.categoryParams;
  }
  getExpCategoriesFromRemote() {
    let params = new HttpParams();

    if (this.categoryParams.search) {
      params = params.append('search', this.categoryParams.search);
    }

    params = params.append('pageIndex', this.categoryParams.pageNumber.toString());
    params = params.append('pageSize', this.categoryParams.pageSize.toString());

    return this.http
      .get<IPagination<IExpenseCategory>>(this.baseUrl + 'Expcategories', {
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

  addExpCategoryRemote(model: IExpenseCategory) {
    return this.http.post(this.baseUrl + 'Expcategories/add-expense-category', model).pipe(
      map((response: IExpenseCategory) => {
        this.categories.push(response);
        return response;
      })
    );
  }

  updateExpCategoryRemote(model: IExpenseCategory) {
    return this.http.post(this.baseUrl + 'Expcategories/update-expense-category', model).pipe(
      map((response: IExpenseCategory) => {
        this.categories.push(response);
        return response;
      })
    );
  }

}
