import { IPagination } from './pagination';

export interface IInvoiceDetail {
  testId: number;
  testName:string;
  quantity: number;
  price: number;
}

export interface IPayment {
    paymentDate:string;
    amount:number;
    method:string;
}

export interface IInvoice {
  bookingNumber: string;
  bookingDate: string;
  deliveryDate: string;
  patientName: string;
  age: number;
  phone: string;
  address: string;
  totalAmount: number;
  discount: number;
  discountType: string;
  totalPayable: number;
  status: string;
  userId: number;
  bookedBy: string;
  doctorName: string;
  specialist: string;
  bookingDetails: IInvoiceDetail[];
  payments: IPayment[];
}

export class InvoicePagination implements IPagination<IInvoice> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: IInvoice[];
}
