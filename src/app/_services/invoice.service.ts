import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IInvoice, InvoicePagination } from '../_models/invoice';
import { EntityParams } from '../_models/entityParams';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPagination } from '../_models/pagination';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  baseUrl = environment.apiUrl;
  invoices: IInvoice[] = [];
  pagination = new InvoicePagination();
  invoiceParams = new EntityParams();
  constructor(private http: HttpClient) {}

  setInvoiceParams(params: EntityParams) {
    this.invoiceParams = params;
  }

  getInvoiceParams() {
    return this.invoiceParams;
  }

  getInvoicesFromRemote() {
    let params = new HttpParams();

    params = params.append(
      'pageIndex',
      this.invoiceParams.pageNumber.toString()
    );
    params = params.append('pageSize', this.invoiceParams.pageSize.toString());

    return this.http
      .get<IPagination<IInvoice>>(this.baseUrl + 'Bookings', {
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

  addInvoiceRemote(model: IInvoice) {
    return this.http.post(this.baseUrl + 'Bookings/add-invoice', model).pipe(
      map((response: IInvoice) => {
        this.invoices.push(response);
        return response;
      })
    );
  }

  getInvoiceByInvoiceNumberFromApi(invoicenumber: string) {
    return this.http.get<IInvoice>(this.baseUrl + 'Bookings/' + invoicenumber);
  }
}
