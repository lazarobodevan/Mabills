import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
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

  getTransactions(query:String) :Observable<ITransactionResponse> {
    let options = { headers: this.headers };
    return this.http.post<ITransactionResponse>(`${environment.API}transactions/filter${query}`,null,options);
  }
}
