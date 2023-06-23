import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { setTheme } from 'ngx-bootstrap/utils';
import { ICategory } from 'src/app/_models/category';
import { IDoctor } from 'src/app/_models/doctor';
import { IEmployee } from 'src/app/_models/employee';
import { IProduct } from 'src/app/_models/product';
import { ProductParams } from 'src/app/_models/productParams';
import { CategoryService } from 'src/app/_services/category.service';
import { DoctorService } from 'src/app/_services/doctor.service';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { ProductService } from 'src/app/_services/product.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
})
export class InvoiceComponent implements OnInit {
  modalRef?: BsModalRef;
  invoiceForm: FormGroup;
  categories: ICategory[];
  products: IProduct[];
  productParams: ProductParams;
  doctors: IDoctor[];
  employees: IEmployee[];
  today_date = new Date();
  minDate: Date;
  deliveryMinDate:Date;
  maxDate: Date;
  invoiceTotal: number = 0;
  // totalInvoicePayable: number = 0;
  payMethods = [
    { id: 'Cash', value: 'Cash' },
    { id: 'Card', value: 'Card' },
    { id: 'e-Wallet', value: 'e-Wallet' },
    { id: 'Due', value: 'Due' },
  ];

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private categoryService: CategoryService,
    private doctorService: DoctorService,
    private productService: ProductService,
    private invoiceService: InvoiceService,
    private router: Router
  ) {
    setTheme('bs4');
    this.minDate = new Date();
    this.maxDate = new Date();
    this.deliveryMinDate = new Date();
    this.minDate.setDate(this.minDate.getDate() - 10);
    this.maxDate.setDate(this.maxDate.getDate());
    this.deliveryMinDate.setDate(this.deliveryMinDate.getDate()+1);

    this.invoiceForm = this.fb.group({
      bookingDate: [this.today_date, [Validators.required]],
      deliveryDate: ['', [Validators.required]],
      doctorId: [1, [Validators.required]],
      patientName: ['', [Validators.required]],
      age: ['', [Validators.required]],
      gender: ['Male', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      totalAmount: [0, [Validators.required]],
      discount: [0],
      discountType: ['Percent'],
      totalPayable: [0, [Validators.required]],
      bookingDetails: this.fb.array([]),
      payments: this.fb.array([
        this.fb.group({
          paymentDate: [
            this.formatDate(this.today_date),
            [Validators.required],
          ],
          amount: [0, [Validators.required, Validators.min(0)]],
          method: ['Cash', [Validators.required]],
        }),
      ]),
    });
  }

  ngOnInit(): void {
    this.getCategories();
    this.getProducts();
    this.getDoctors();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  get invoiceDetails(): FormArray {
    return this.invoiceForm.get('bookingDetails') as FormArray;
  }

  get payments(): FormArray {
    return this.invoiceForm.get('payments') as FormArray;
  }

  addInvoiceDetails(product: IProduct) {
    this.invoiceDetails.push(this.addServicetoInvoice(product));
    this.calcuateTotalInvoiceAmount();
    this.calculateTotalInvoicePayable();
  }

  removeInvoiceDetails(i: number) {
    this.invoiceDetails.removeAt(i);
    this.calcuateTotalInvoiceAmount();
    this.calculateTotalInvoicePayable();
    this.invoiceForm.patchValue({
      discount: 0,
    });
  }

  addServicetoInvoice(product: IProduct): FormGroup {
    return this.fb.group({
      testId: [product.id, [Validators.required]],
      testName: [product.name],
      quantity: [1, [Validators.required]],
      price: [product.price, [Validators.required]],
      totalAmount: product.price * 1,
    });
  }

  onCategoryChanged(event: any) {
    let categoryid = (event.target as HTMLInputElement).value;
    const params = this.productService.getProductParams();
    params.categoryId = parseInt(categoryid);
    this.productService.setProductParams(params);
    this.getProducts();
  }

  getProducts() {
    this.productService.getProductsFromRemote().subscribe({
      next: (response) => {
        this.products = response.data;
      },
    });
  }

  getCategories() {
    this.categoryService.getCategoriesFromRemote(1, 20).subscribe({
      next: (response) => {
        this.categories = [
          { id: 0, categoryName: 'Category' },
          ...response.data,
        ];
      },
    });
  }

  getDoctors() {
    this.doctorService.getDoctorsFromRemote().subscribe({
      next: (response) => {
        this.doctors = response.data;
      },
    });
  }

  onChangePaymentMethod(event: any) {
    let method = event.target.value;
    if (method === 'Due') {
      this.payments.at(0).patchValue({
        amount: 0,
      });
    }
  }

  calcuateTotalInvoiceAmount() {
    let sum: number = 0;
    this.invoiceDetails.controls.forEach(
      (element) => (sum += element.value.totalAmount)
    );
    this.invoiceForm.patchValue({
      totalAmount: sum,
    });
    return sum;
  }

  calculateTotalInvoicePayable(): number {
    let sum: number = 0;
    this.invoiceDetails.controls.forEach(
      (element) => (sum += element.value.totalAmount)
    );
    this.invoiceForm.patchValue({
      totalPayable: sum,
    });
    this.payments.at(0).patchValue({
      amount: sum,
    });
    return sum;
  }

  calculateInvoiceAfterAddingDiscount(type: string, amount: any) {
    let amnt = parseInt(amount);
    let payableAmount: number = this.calculateTotalInvoicePayable();
    if (type == 'percent') {
      let discount_amnt = (payableAmount * amnt) / 100;
      payableAmount = payableAmount - discount_amnt;
      this.invoiceForm.patchValue({
        discount: discount_amnt,
        totalPayable: payableAmount,
      });
    } else {
      payableAmount = payableAmount - amnt;
      this.invoiceForm.patchValue({
        discount: amnt,
        totalPayable: payableAmount,
      });
    }

    this.payments.at(0).patchValue({
      amount: payableAmount,
    });
  }

  addInvoice() {
    const invoice = this.invoiceForm.value;
    if (invoice.totalPayable === invoice.payments[0].amount) {
      invoice.status = 'Paid';
    } else {
      invoice.status = 'Unpaid';
    }

    if (invoice.payments[0].method === 'Due') {
      invoice.payments = [];
    }

    //invoice.invoiceDate = this.formatDate(invoice.invoiceDate);
    //invoice.deliveryDate = this.formatDate(invoice.deliveryDate);

    this.invoiceService.addInvoiceRemote(invoice).subscribe({
      next: (response) => {
        console.warn(response);
        this.invoiceForm.reset();
        this.router.navigateByUrl('/invoice/' + response.bookingNumber);
      },
    });
  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  formatDate(date: Date) {
    return [
      date.getFullYear(),
      this.padTo2Digits(date.getMonth() + 1),
      this.padTo2Digits(date.getDate()),
    ].join('-');
  }
}
