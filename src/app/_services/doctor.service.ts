import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DoctorPagination, IDoctor } from '../_models/doctor';
import { IPagination } from '../_models/pagination';
import { map } from 'rxjs';
import { EntityParams } from '../_models/entityParams';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  baseUrl = environment.apiUrl;
  doctors: IDoctor[] = [];
  doctorParams = new EntityParams();
  pagination = new DoctorPagination();
  constructor(private http: HttpClient) {}

  setdoctorParams(params: EntityParams) {
    this.doctorParams = params;
  }

  getdoctorParams() {
    return this.doctorParams;
  }

  getDoctorsFromRemote() {
    let params = new HttpParams();

    if (this.doctorParams.search) {
      params = params.append('search', this.doctorParams.search);
    }

    params = params.append('pageIndex', this.doctorParams.pageNumber.toString());
    params = params.append('pageSize', this.doctorParams.pageSize.toString());

    return this.http
      .get<IPagination<IDoctor>>(this.baseUrl + 'Doctors', {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          this.pagination = response.body;
          return this.pagination;
        })
      );
  }

  addDoctorRemote(model: IDoctor) {
    return this.http.post(this.baseUrl + 'Doctors/add-doctor', model).pipe(
      map((response: IDoctor) => {
        this.doctors.push(response);
        return response;
      })
    );
  }
  updateDoctorRemote(model: IDoctor) {
    return this.http.post(this.baseUrl + 'Doctors/update-doctor', model).pipe(
      map((response: IDoctor) => {
        this.doctors.push(response);
        return response;
      })
    );
  }
}
