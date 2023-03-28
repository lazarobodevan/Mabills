import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { IFilter } from '../interfaces/IFilter';
import { ITransaction } from '../interfaces/ITransaction';
import { ITransactionRequest } from '../interfaces/ITransactionRequest';
import { ITransactionResponse } from '../interfaces/ITransactionResponse';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private headers = new HttpHeaders({
    'Content-type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  });
  
  constructor(private http: HttpClient) { 
  }

  createTransaction(transaction:ITransactionRequest):Observable<ITransaction>{
    let options = {headers: this.headers};
    return this.http.post<ITransaction>(`${environment.API}transactions`, transaction, options);
  }

  getTransactions(query:string, body?:IFilter) :Observable<ITransactionResponse> {
    let options = { headers: this.headers };
    console.log(body);
    return this.http.post<ITransactionResponse>(`${environment.API}transactions/filter${query}`,body,options).pipe(tap(response =>{
      console.log("aaa"+JSON.stringify(response))
    }));
  }
}
