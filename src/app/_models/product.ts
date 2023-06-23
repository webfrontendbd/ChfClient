import { IPagination } from "./pagination";

export interface IProduct {
    id:number;
    name:string;
    description:string;
    price:number;
    isActived:boolean;
    categoryId:number;
    categoryName:string;
}

export class ProductPagination implements IPagination<IProduct> {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: IProduct[];
    
  }