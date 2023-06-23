import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ICategory } from 'src/app/_models/category';
import { IProduct } from 'src/app/_models/product';
import { ProductParams } from 'src/app/_models/productParams';
import { CategoryService } from 'src/app/_services/category.service';
import { ProductService } from 'src/app/_services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  modalRef?: BsModalRef;
  products: IProduct[];
  categories: ICategory[];
  totalCount: number;
  productParams: ProductParams;
  productForm: FormGroup;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    this.productParams = this.productService.getProductParams();
    this.productForm = fb.group({
      testName: ['', [Validators.required]],
      description: [''],
      price: ['', [Validators.required]],
      categoryId: [1, [Validators.required]],
      isActived: ['active', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getProducts();
    this.getCategories();
  }

  getProducts() {
    this.productService.getProductsFromRemote().subscribe({
      next: (response) => {
        this.products = response.data;
        this.totalCount = response.count;
      },
    });
  }

  getCategories() {
    this.categoryService
      .getCategoriesFromRemote(
        this.productParams.pageNumber,
        this.productParams.pageSize
      )
      .subscribe({
        next: (response) => {
          this.categories = response.data;
        },
      });
  }

  pageChanged(event: any) {
    const params = this.productService.getProductParams();
    if (params.pageNumber !== event) {
      params.pageNumber = event;
      this.productService.setProductParams(params);
      this.getProducts();
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-xl' })
    );
  }

  openUpdateModal(product: IProduct, template: TemplateRef<any>) {
    this.productForm = this.fb.group({
      id: [product.id, [Validators.required, Validators.min(1)]],
      name: [product.name, [Validators.required]],
      description: [product.description],
      price: [product.price, [Validators.required]],
      categoryId: [product.categoryId, [Validators.required]],
      isActived: [product.isActived, [Validators.required]],
    });

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-xl' })
    );
  }

  saveProduct() {
    this.productService.addProductRemote(this.productForm.value).subscribe({
      next: (response) => {
        this.products.push(response);
        this.productForm.reset();
      },
    });
  }

  updateProduct(){
    this.productService.updateProductRemote(this.productForm.value).subscribe({
      next: (response) => {
        this.getProducts();
        this.productForm.reset();
        this.modalRef?.hide();
      },
    });
  }

}
