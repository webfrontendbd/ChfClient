import { Component, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IDoctor } from 'src/app/_models/doctor';
import { EntityParams } from 'src/app/_models/entityParams';
import { DoctorService } from 'src/app/_services/doctor.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent {
  modalRef?: BsModalRef;
  doctors: IDoctor[];
  totalCount: number;
  pageIndex: number = 1;
  pageSize: number = 10;
  doctorParams = new EntityParams();
  doctorForm: FormGroup;
  isLoading=false;

  constructor(
    private doctorService: DoctorService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    this.doctorService.getdoctorParams();
    this.doctorForm = fb.group({
      doctorName: ['', [Validators.required]],
      gender:['Male', [Validators.required]],
      specialist:['', [Validators.required]],
      phone:['',[Validators.required]],
      isActivated:[true, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getDoctors();
  }

  getDoctors() {
    this.doctorService
      .getDoctorsFromRemote()
      .subscribe({
        next: (response) => {
          this.doctors = response.data;
          this.totalCount = response.count;
        },
      });
  }

  pageChanged(event: any) {
    const params = this.doctorService.getdoctorParams();
    if (params.pageNumber !== event) {
      params.pageNumber = event;
      this.doctorService.setdoctorParams(params);
      this.getDoctors();
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-xl' })
    );
  }

  openUpdateModal(doctor:IDoctor, template: TemplateRef<any>){

    this.doctorForm = this.fb.group({
      id:[doctor.id, [Validators.required, Validators.min(1)]],
      doctorName: [doctor.doctorName, [Validators.required]],
      gender:[doctor.gender, [Validators.required]],
      specialist:[doctor.specialist, [Validators.required]],
      phone:[doctor.phone,[Validators.required]],
      isActivated:[doctor.isActivated, [Validators.required]]
    });

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-xl' })
    );
  }
  
  saveDoctor() {
    this.doctorService.addDoctorRemote(this.doctorForm.value).subscribe({
      next: (response) => {
        this.doctors.push(response);
        this.doctorForm.reset();
      },
    });
  }

  updateDoctor(){
    this.doctorService.updateDoctorRemote(this.doctorForm.value).subscribe({
      next: (response) => {
        this.getDoctors();
        this.doctorForm.reset();
        this.modalRef?.hide();
      },
    });
  }
}
