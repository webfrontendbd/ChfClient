import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopnavComponent } from './coreui/topnav/topnav.component';
import { AsidenavComponent } from './coreui/asidenav/asidenav.component';
import { FooterComponent } from './coreui/footer/footer.component';
import { HomeComponent } from './home/home.component';
import { CoreuiComponent } from './coreui/coreui.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorInterceptor } from './_interceptors/error.interceptor';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { ToastrModule } from 'ngx-toastr';
import { InvoiceComponent } from './_pages/invoice/invoice.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CategoryComponent } from './_pages/category/category.component';
import { ProductComponent } from './_pages/product/product.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { DoctorComponent } from './_pages/doctor/doctor.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditorModule } from '@tinymce/tinymce-angular';
import { PagerComponent } from './_pages/common/pager/pager.component';
import { EmployeeComponent } from './_pages/employee/employee.component';
import { ListComponent } from './_pages/invoice/list/list.component';
import { PrintInvoiceComponent } from './_pages/invoice/print-invoice/print-invoice.component';
import { NgxPrintModule } from 'ngx-print';
import { ExpenseCategoryComponent } from './_pages/expense/expense-category/expense-category.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingInterceptor } from './_interceptors/loading.interceptor';
import { HighchartsChartModule } from 'highcharts-angular';
import { ExpenseComponent } from './_pages/expense/expense.component';
import { AmountSuffixPipe } from './amount-suffix.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CoreuiComponent,
    TopnavComponent,
    AsidenavComponent,
    FooterComponent,
    NotFoundComponent,
    ServerErrorComponent,
    HomeComponent,
    InvoiceComponent,
    CategoryComponent,
    ProductComponent,
    DoctorComponent,
    PagerComponent,
    EmployeeComponent,
    ExpenseComponent,
    ListComponent,
    PrintInvoiceComponent,
    ExpenseCategoryComponent,
    AmountSuffixPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    AutocompleteLibModule,
    EditorModule,
    NgxPrintModule,
    NgxSpinnerModule.forRoot({ type: 'timer' }),
    ToastrModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    HighchartsChartModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
