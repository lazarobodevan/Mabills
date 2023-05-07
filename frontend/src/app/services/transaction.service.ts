import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IFilter } from '../interfaces/IFilter';
import { ITransaction } from '../interfaces/ITransaction';
import { ITransactionRequest } from '../interfaces/ITransactionRequest';
import { ITransactionResponse } from '../interfaces/ITransactionResponse';
import { NotifierService } from './notifier.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private headers = new HttpHeaders({
    'Content-type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  });
  
  constructor(private http: HttpClient, private notifierService:NotifierService) { 
  }

  createTransaction(transaction:ITransactionRequest):Observable<ITransaction>{
    let options = {headers: this.headers};
    return this.http.post<ITransaction>(`${environment.API}transactions`, {...transaction, date: moment(transaction.date).format('DD/MM/YYYY')}, options);
  }

  getTransactions(query:string, body?:IFilter) :Observable<ITransactionResponse> {
    let options = { headers: this.headers };
    return this.http.post<ITransactionResponse>(`${environment.API}transactions/filter${query}`,body,options);
  }

  deleteTransaction(id:string):Observable<any>{
    let options = { headers: this.headers };
    console.log(id);
    return this.http.delete(`${environment.API}transactions/${id}`, options);
  }

  updateTransaction(transaction:ITransactionRequest):Observable<ITransaction>{
    let options = { headers: this.headers };
    const {_id, ...newTransaction} = transaction
    return this.http.put<ITransaction>(`${environment.API}transactions/${_id}`, {...newTransaction, date: moment(newTransaction.date).format('DD/MM/YYYY')}, options);
  }
}
