import { Component, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EntityParams } from 'src/app/_models/entityParams';
import { IExpenseCategory } from 'src/app/_models/expenseCategory';
import { ExpenseCategoryService } from 'src/app/_services/expense-category.service';

@Component({
  selector: 'app-expense-category',
  templateUrl: './expense-category.component.html',
  styleUrls: ['./expense-category.component.css']
})
export class ExpenseCategoryComponent {
  modalRef?: BsModalRef;
  categories: IExpenseCategory[];
  totalCount: number;
  pageIndex: number = 1;
  pageSize: number = 10;
  customerParams = new EntityParams();
  categoryForm: FormGroup;
  isLoading=false;

  constructor(
    private categoryService: ExpenseCategoryService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    this.categoryService.getCategoryParams();
    this.categoryForm = this.fb.group({
      categoryName: ['', [Validators.required]],
      code:['',[Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.categoryService
      .getExpCategoriesFromRemote()
      .subscribe({
        next: (response) => {
          this.categories = response.data;
          this.totalCount = response.count;
        },
      });
  }

  pageChanged(event: any) {
    const params = this.categoryService.getCategoryParams();
    if (params.pageNumber !== event) {
      params.pageNumber = event;
      this.categoryService.setCategoryParams(params);
      this.getCategories();
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-xl' })
    );
  }

  openUpdateModal(category:IExpenseCategory, template:TemplateRef<any>){
    this.categoryForm = this.fb.group({
      id:[category.id, [Validators.required, Validators.min(1)]],
      categoryName: [category.categoryName, [Validators.required]],
      code:[category.code,[Validators.required]]
    });

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-xl' })
    );
  }
  
  saveCategory() {
    this.categoryService.addExpCategoryRemote(this.categoryForm.value).subscribe({
      next: (response) => {
        this.categories.push(response);
        this.categoryForm.reset();
      },
    });
  }

  updateCategory() {
    this.categoryService.updateExpCategoryRemote(this.categoryForm.value).subscribe({
      next: (response) => {
        this.getCategories();
        this.categoryForm.reset();
        this.modalRef?.hide();
      },
    });
  }
}
