import { IPagination } from "./pagination";

export interface IExpenseCategory {
    id: number;
    categoryName: string;
    code : string;
  }
  
  export class ExpenseCategoryPagination implements IPagination<IExpenseCategory> {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: IExpenseCategory[];
    
  }