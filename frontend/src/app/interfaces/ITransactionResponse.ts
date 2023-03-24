import { ITransaction } from "./ITransaction";

export interface ITransactionResponse{
    limit: number,
    nextUrl: string,
    offset: number,
    previousUrl: string,
    results:[ITransaction],
    total: number
}