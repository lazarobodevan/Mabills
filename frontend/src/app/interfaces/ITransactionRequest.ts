export interface ITransactionRequest {
    _id?: string,
    name: string,
    value: number,
    date: Date,
    type: string,
    isPaid?: boolean,
    categoryId: string
}