import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IInvoice, IInvoiceDetail, IPayment } from 'src/app/_models/invoice';
import { InvoiceService } from 'src/app/_services/invoice.service';

@Component({
  selector: 'app-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.css']
})
export class PrintInvoiceComponent {
  invoice: IInvoice;
  constructor(
    private invoiceService: InvoiceService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
   this.getInvoiceDetails();
  }

  getInvoiceDetails() {
    const invoice_snap = this.route.snapshot.paramMap.get('invoicenumber');
    if (!invoice_snap) return;
    this.invoiceService.getInvoiceByInvoiceNumberFromApi(invoice_snap).subscribe({
      next: (result) => {
        this.invoice = result;
      },
    });
  }

  sumInvoiceSubTotal(invoiceDetails: Array<IInvoiceDetail>) {
    let subtotal: number = 0;
    invoiceDetails.forEach((e) => (subtotal += e.price * e.quantity));
    return subtotal;
  }

  sumInvoiceGrandTotal(invoice: IInvoice) {
    let grandtotal: number = 0;
    invoice.bookingDetails.forEach(
      (e) => (grandtotal += e.price * e.quantity)
    );
    grandtotal = grandtotal - invoice.discount;
    return grandtotal;
  }

  sumInvoicePaymentAmount(payments: Array<IPayment>) {
    let paidTotal: number = 0;
    if (payments.length > 0) {
      payments.forEach((e) => (paidTotal += e.amount));
    }
    return paidTotal;
  }
}