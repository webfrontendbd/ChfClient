import { Component, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IEmployee } from 'src/app/_models/employee';
import { EntityParams } from 'src/app/_models/entityParams';
import { EmployeeService } from 'src/app/_services/employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {
  modalRef?: BsModalRef;
  employees: IEmployee[];
  totalCount: number;
  pageIndex: number = 1;
  pageSize: number = 10;
  employeeParams = new EntityParams();
  employeeForm: FormGroup;
  isLoading=false;

  constructor(
    private employeeService: EmployeeService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
   this.employeeService.getEmployeeParams();
    this.employeeForm = fb.group({
      name: ['', [Validators.required]],
      phone:['',[Validators.required]],
      address:['']
    });
  }

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees() {
    this.employeeService
      .getEmployeesFromRemote()
      .subscribe({
        next: (response) => {
          this.employees = response.data;
          this.totalCount = response.count;
        },
      });
  }

  pageChanged(event: any) {
    const params = this.employeeService.getEmployeeParams();
    if (params.pageNumber !== event) {
      params.pageNumber = event;
      this.employeeService.setEmployeeParams(params);
      this.getEmployees();
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-xl' })
    );
  }

  openUpdateModal(employee:IEmployee, template:TemplateRef<any>){
    this.employeeForm = this.fb.group({
      id:[employee.id, [Validators.required, Validators.min(1)]],
      name: [employee.name, [Validators.required]],
      phone:[employee.phone,[Validators.required]],
      address:[employee.address]
    });

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }
  
  saveEmployee() {
    this.employeeService.addEmployeeRemote(this.employeeForm.value).subscribe({
      next: (response) => {
        this.employees.push(response);
        this.employeeForm.reset();
      },
    });
  }
  updateEmployee(){
    this.employeeService.updateEmployeeRemote(this.employeeForm.value).subscribe({
      next: (response) => {
        this.getEmployees();
        this.employeeForm.reset();
        this.modalRef?.hide();
      },
    });
  }
}
