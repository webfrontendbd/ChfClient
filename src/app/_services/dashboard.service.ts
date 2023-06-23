import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TopCardDto } from '../_models/dashboardModels/cardDto';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getTopCardInfoFromRemote(){
    return this.http.get<TopCardDto>(this.baseUrl+'Dashboards/dashboard-top-card-info');
  }
  getSalesAndExpensesChartInfoFromRemote(){
    return this.http.get(this.baseUrl+'Dashboards/dashboard-sale-expense-chart');
  }
  getTopFiveEmployeeChartInfoFromRemote(){
    return this.http.get(this.baseUrl+'Dashboards/dashboard-top-employee-chart');
  }
}
