import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  generatePdfFromRemote(invoicenumber:string){
    return this.http.
    get(this.baseUrl + 'Reports/pos-receipt-mini?invoicenumber=' + invoicenumber, {observe:'response', responseType:'blob'});
  }
}
