import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IEmployee } from 'src/app/_models/employee';
import { EntityParams } from 'src/app/_models/entityParams';
import { IExpense } from 'src/app/_models/expense';
import { IExpenseCategory } from 'src/app/_models/expenseCategory';
import { ExpenseCategoryService } from 'src/app/_services/expense-category.service';
import { ExpenseService } from 'src/app/_services/expense.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
})
export class ExpenseComponent implements OnInit {
  modalRef?: BsModalRef;
  expenses: IExpense[];
  categories: IExpenseCategory[];
  beneficiaries: IEmployee[];
  totalCount: number;
  expenseParams: EntityParams;
  expenseForm: FormGroup;
  today_date = new Date();
  minDate: Date;
  maxDate: Date;

  constructor(
    private expenseService: ExpenseService,
    private categoryService: ExpenseCategoryService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    this.expenseParams = this.expenseService.getExpenseParams();
    this.expenseForm = fb.group({
      expenseDate: [this.today_date, [Validators.required]],
      expenseCategoryId: [1, [Validators.required]],
      employeeId: [1, [Validators.required]],
      amount: [0, [Validators.required, Validators.min(1)]],
      expenseNotes: [''],
    });
  }

  ngOnInit(): void {
    this.getCategories();
    this.getExpenseForCategories();
    this.getExpenses();
  }

  getExpenses() {
    this.expenseService.getExpenseFromRemote().subscribe({
      next: (response) => {
        this.expenses = response.data;
        this.totalCount = response.count;
      },
    });
  }

  getCategories() {
    this.categoryService.getExpCategoriesFromRemote().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
    });
  }

  getExpenseForCategories() {
    this.expenseService.getBeneficiariesFromRemote().subscribe({
      next: (response) => {
        this.beneficiaries = response;
      },
    });
  }

  pageChanged(event: any) {
    const params = this.expenseService.getExpenseParams();
    if (params.pageNumber !== event) {
      params.pageNumber = event;
      this.expenseService.setExpenseParams(params);
      this.getExpenses();
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-xl' })
    );
  }

  openUpdateModal(expense: IExpense, template: TemplateRef<any>) {
    this.expenseForm = this.fb.group({
      id: [expense.id, [Validators.required, Validators.min(1)]],
      expenseDate: [expense.expenseDate, [Validators.required]],
      expenseCategoryId: [expense.expenseCategoryId, [Validators.required]],
      employeeId: [expense.employeeId, [Validators.required]],
      amount: [expense.amount, [Validators.required, Validators.min(1)]],
      expenseNotes: [expense.expenseNotes],
    });

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-xl' })
    );
  }

  saveExpense() {
    this.expenseService.addExpenseRemote(this.expenseForm.value).subscribe({
      next: (response) => {
        this.getExpenses();
        this.expenseForm.reset();
      },
    });
  }

  updateExpense() {
    this.expenseService.updateExpenseRemote(this.expenseForm.value).subscribe({
      next: (response) => {
        this.getExpenses();
        this.expenseForm.reset();
        this.modalRef?.hide();
      },
    });
  }
}
