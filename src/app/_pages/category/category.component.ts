import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ICategory } from 'src/app/_models/category';
import { CategoryService } from 'src/app/_services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  modalRef?: BsModalRef;
  categories: ICategory[];
  totalCount: number;
  pageIndex: number = 1;
  pageSize: number = 10;
  categoryForm: FormGroup;
  isLoading=false;

  constructor(
    private categoryService: CategoryService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    this.categoryForm = fb.group({
      categoryName: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.categoryService
      .getCategoriesFromRemote(this.pageIndex, this.pageSize)
      .subscribe({
        next: (response) => {
          this.categories = response.data;
          this.totalCount = response.count;
        },
      });
  }

  pageChanged(event: any) {
    if (this.pageIndex !== event.page) {
      this.pageIndex = event.page;
      this.getCategories();
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }
  openUpdateModal(category:ICategory, template: TemplateRef<any>){

    this.categoryForm = this.fb.group({
      id:[category.id, [Validators.required, Validators.min(1)]],
      categoryName: [category.categoryName, [Validators.required]]
    });

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }
  saveCategory() {
    this.categoryService.addCategoryRemote(this.categoryForm.value).subscribe({
      next: (response) => {
        this.categories.push(response);
        this.categoryForm.reset();
      },
    });
  }

  updateServiceCategory(){
    this.categoryService.updateCategoryRemote(this.categoryForm.value).subscribe({
      next: (response) => {
        this.getCategories();
        this.categoryForm.reset();
        this.modalRef?.hide();
      },
    });
  }


}
