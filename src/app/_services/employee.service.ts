import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmployeePagination, IEmployee } from '../_models/employee';
import { environment } from 'src/environments/environment';
import { EntityParams } from '../_models/entityParams';
import { IPagination } from '../_models/pagination';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  baseUrl = environment.apiUrl;
  employees: IEmployee[] = [];
  employeeParams = new EntityParams();
  pagination = new EmployeePagination();
  constructor(private http: HttpClient) {}

  setEmployeeParams(params: EntityParams) {
    this.employeeParams = params;
  }

  getEmployeeParams() {
    return this.employeeParams;
  }

  getEmployeesFromRemote() {
    let params = new HttpParams();

    if (this.employeeParams.search) {
      params = params.append('search', this.employeeParams.search);
    }

    params = params.append('pageIndex', this.employeeParams.pageNumber.toString());
    params = params.append('pageSize', this.employeeParams.pageSize.toString());

    return this.http
      .get<IPagination<IEmployee>>(this.baseUrl + 'Employees', {
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

  addEmployeeRemote(model: IEmployee) {
    return this.http.post(this.baseUrl + 'Employees/add-employee', model).pipe(
      map((response: IEmployee) => {
        this.employees.push(response);
        return response;
      })
    );
  }

  updateEmployeeRemote(model: IEmployee) {
    return this.http.post(this.baseUrl + 'Employees/update-employee', model).pipe(
      map((response: IEmployee) => {
        this.employees.push(response);
        return response;
      })
    );
  }
}
