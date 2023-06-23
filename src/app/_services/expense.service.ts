import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ExpensePagination, IExpense } from '../_models/expense';
import { EntityParams } from '../_models/entityParams';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { IPagination } from '../_models/pagination';
import { IEmployee } from '../_models/employee';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  baseUrl = environment.apiUrl;
  expenses: IExpense[] = [];
  benificiaries: IEmployee[] = [];
  pagination = new ExpensePagination();
  expenseParams = new EntityParams();
  constructor(private http: HttpClient) {}

  setExpenseParams(params: EntityParams) {
    this.expenseParams = params;
  }

  getExpenseParams() {
    return this.expenseParams;
  }

  getExpenseFromRemote() {
    let params = new HttpParams();

    params = params.append(
      'pageIndex',
      this.expenseParams.pageNumber.toString()
    );
    params = params.append('pageSize', this.expenseParams.pageSize.toString());

    return this.http
      .get<IPagination<IExpense>>(this.baseUrl + 'Expenses', {
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

  getBeneficiariesFromRemote() {
    return this.http
      .get<IPagination<IEmployee>>(this.baseUrl + 'Employees', {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          return (this.benificiaries = response.body.data);
        })
      );
  }

  addExpenseRemote(model: IExpense) {
    return this.http.post(this.baseUrl + 'Expenses/add-expense', model).pipe(
      map((response: IExpense) => {
        this.expenses.push(response);
        return response;
      })
    );
  }

  updateExpenseRemote(model: IExpense) {
    return this.http.post(this.baseUrl + 'Expenses/update-expense', model).pipe(
      map((response: IExpense) => {
        this.expenses.push(response);
        return response;
      })
    );
  }
}
