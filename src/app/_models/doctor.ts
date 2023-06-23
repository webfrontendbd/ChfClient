import { IPagination } from "./pagination";

export interface IDoctor {
    id:number;
    doctorName:string;
    gender:string;
    phone:string;
    specialist:string;
    isActivated:boolean;
}

export class DoctorPagination implements IPagination<IDoctor>{
    pageIndex: number;
    pageSize: number;
    count: number;
    data: IDoctor[];

}