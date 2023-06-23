import { IPagination } from "./pagination";

export interface IEmployee {
    id:number;
    name:string;
    phone:string;
    address:string;
}

export class EmployeePagination implements IPagination<IEmployee>{
    pageIndex: number;
    pageSize: number;
    count: number;
    data: IEmployee[];

}