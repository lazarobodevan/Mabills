import { ICategory } from "./ICategory";

export interface ITransaction {
    _id?: string,
    name: string,
    value: number,
    date: Date,
    type: string,
    isPaid?: boolean,
    categoryId: ICategory
}