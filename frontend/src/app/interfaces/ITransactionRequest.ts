export interface ITransactionRequest {
    _id?: string,
    name: string,
    value: number,
    date: string,
    type: string,
    isPaid?: boolean,
    categoryId: string
}