import { Component } from '@angular/core';
import { EntityParams } from 'src/app/_models/entityParams';
import { IInvoice } from 'src/app/_models/invoice';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { ReportService } from 'src/app/_services/report.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent {
  invoices: IInvoice[];
  totalCount: number;
  pageIndex: number = 1;
  pageSize: number = 10;
  invoiceParams = new EntityParams();

  constructor(
    private invoiceService: InvoiceService,
    private reportService: ReportService
  ) {
    this.invoiceService.getInvoiceParams();
  }

  ngOnInit(): void {
    this.getInvoices();
  }

  getInvoices() {
    this.invoiceService.getInvoicesFromRemote().subscribe({
      next: (response) => {
        this.invoices = response.data;
        this.totalCount = response.count;
      },
    });
  }

  pageChanged(event: any) {
    const params = this.invoiceService.getInvoiceParams();
    if (params.pageNumber !== event) {
      params.pageNumber = event;
      this.invoiceService.setInvoiceParams(params);
      this.getInvoices();
    }
  }

  printInvoice(invoicenumber: string) {
    this.reportService.generatePdfFromRemote(invoicenumber).subscribe({
      next: (response) => {
        const bolb: Blob = response.body as Blob;
        const url = URL.createObjectURL(bolb);
        const printWindow = window.open(url);
        printWindow.print();
      },
    });
  }
}
