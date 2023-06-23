import { Component, OnInit } from '@angular/core';
import { TopCardDto } from '../_models/dashboardModels/cardDto';
import { DashboardService } from '../_services/dashboard.service';
import * as Highcharts from 'highcharts';
import { SalesExpensesChartDto } from '../_models/dashboardModels/salesExpenseChartDto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  topCardInfo: TopCardDto;
  isHighcharts = typeof Highcharts === 'object';
  Highcharts: typeof Highcharts = Highcharts;
  salesExpensesLineChartOptions: Highcharts.Options;
  topFiveEmployeeBarChartOptions: Highcharts.Options;
  salesExpensesChartData: any;
  topEmployeeBarChartData: any;

  constructor(private dashboardService: DashboardService) {}


  ngOnInit(): void {
    this.getTopCardInfo();
    this.getSalesExpensesChartInfo();
    this.getTopFiveEmployeeInfo();
  }

  getTopCardInfo() {
    this.dashboardService.getTopCardInfoFromRemote().subscribe({
      next: (response) => {
        this.topCardInfo = response;
      },
    });
  }

  getSalesExpensesChartInfo() {
    this.dashboardService.getSalesAndExpensesChartInfoFromRemote().subscribe({
      next: (response) => {
        this.salesExpensesChartData = response;
        this.salesExpensesLineChartOptions = {
          title: {
            text: 'Sales & Expenses Graph',
            align: 'left',
          },

          yAxis: {
            title: {
              text: 'Amount',
            },
          },
          credits: {
            enabled: false,
          },
          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
          },

          plotOptions: {
            series: {
              label: {
                connectorAllowed: false,
              },
              pointStart: 1,
            },
          },

          series: this.salesExpensesChartData,

          responsive: {
            rules: [
              {
                condition: {
                  maxWidth: 500,
                },
                chartOptions: {
                  legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                  },
                },
              },
            ],
          },
        };
      },
    });
  }

  getTopFiveEmployeeInfo() {
    this.dashboardService.getTopFiveEmployeeChartInfoFromRemote().subscribe({
      next: (response:any) => {

        let categoryList =[];
        let dataList=[];
        for (let i = 0; i < response.length; i++) {
          categoryList.push(response[i].name);
          dataList.push(response[i].amount);
        }

        this.topEmployeeBarChartData = [{
          name:'',
          data:dataList
        }];

        this.topFiveEmployeeBarChartOptions = {
          chart: {
            type: 'bar',
          },
          title: {
            text: 'Top 5 Employee',
            align: 'left',
          },
          xAxis: {
            categories: categoryList,
            title: {
              text: null,
            },
            gridLineWidth: 1,
            lineWidth: 0,
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Earnings',
              align: 'high',
            },
            labels: {
              overflow: 'justify',
            },
            gridLineWidth: 0,
          },
          tooltip: {
            valueSuffix: '',
          },
          plotOptions: {
            bar: {
              borderRadius: '50%',
              dataLabels: {
                enabled: true,
              },
              groupPadding: 0.1,
            },
          },
          legend: {
            enabled: false,
          },
          credits: {
            enabled: false,
          },
          series: this.topEmployeeBarChartData,
        };
      },
    });
  }
}
