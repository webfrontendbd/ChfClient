import { IPagination } from './pagination';

export interface IExpense {
  id: number;
  expenseDate: Date;
  expenseCategoryId: number;
  categoryName:string;
  employeeId: number;
  employeeName:string;
  amount: number;
  expenseNotes: string;
}

export class ExpensePagination implements IPagination<IExpense> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: IExpense[];
}
