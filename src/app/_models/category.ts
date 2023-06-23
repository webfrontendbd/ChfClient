import { IPagination } from "./pagination";

export interface ICategory {
  id: number;
  categoryName: string;
}

export class CategoryPagination implements IPagination<ICategory> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: ICategory[];
  
}
