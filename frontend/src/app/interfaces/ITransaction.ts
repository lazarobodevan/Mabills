import { ICategory } from "./ICategory";

export interface ITransaction {
    id?: string,
    name: string,
    value: number,
    date: Date,
    type: string,
    isPaid: boolean,
    category: ICategory
}