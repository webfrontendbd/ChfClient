import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CoreuiComponent } from './coreui/coreui.component';
import { AuthGuard } from './_guards/auth.guard';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { NonAuthGuard } from './_guards/noauth.guard';
import { InvoiceComponent } from './_pages/invoice/invoice.component';
import { ProductComponent } from './_pages/product/product.component';
import { CategoryComponent } from './_pages/category/category.component';
import { DoctorComponent } from './_pages/doctor/doctor.component';
import { EmployeeComponent } from './_pages/employee/employee.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { ListComponent } from './_pages/invoice/list/list.component';
import { PrintInvoiceComponent } from './_pages/invoice/print-invoice/print-invoice.component';
import { ExpenseComponent } from './_pages/expense/expense.component';
import { ExpenseCategoryComponent } from './_pages/expense/expense-category/expense-category.component';

const authModule = () =>
  import('./modules/auth/auth.module').then((x) => x.AuthModule);

  const routes: Routes = [
  {
    path: '',
    component: CoreuiComponent,
    runGuardsAndResolvers: 'always',
    canActivate:[AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: HomeComponent,
      },
      {
        path:'categories',
        component:CategoryComponent
      },
      {
        path:'doctors',
        component:DoctorComponent
      },
      {
        path:'employee',
        component:EmployeeComponent
      },
      {
        path:'services',
        component:ProductComponent
      },
      {
        path: 'invoices',
        component: InvoiceComponent,
      },
      {
        path: 'invoice/:invoicenumber',
        component: PrintInvoiceComponent,
      },
      {
        path: 'invoices/list',
        component: ListComponent,
      },
      {
        path: 'expense-category',
        component: ExpenseCategoryComponent,
      },
      {
        path: 'expenses',
        component: ExpenseComponent,
      },
      {
        path: '',
        component: HomeComponent,
      },
    ],
  },
  { path: 'auth', loadChildren: authModule, canActivate:[NonAuthGuard] },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
