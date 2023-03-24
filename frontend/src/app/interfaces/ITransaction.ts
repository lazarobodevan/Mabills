import { ICategory } from "./ICategory";

export interface ITransaction {
    _id?: string,
    name: string,
    value: number,
    date: string,
    type: string,
    isPaid: boolean,
    category: ICategory
}