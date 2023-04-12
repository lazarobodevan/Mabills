import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { IExpenseIncomeByCategory } from '../interfaces/IIncomeByCategory';
import { ITransaction } from '../interfaces/ITransaction';
import { IWeekCards } from '../interfaces/IWeekCards';
import { TransactionService } from './transaction.service';
import { IMonthCards } from '../interfaces/IMonthCards';


@Injectable({
  providedIn: 'root'
})

export class DashboardService {

  private headers = new HttpHeaders({
    'Content-type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  });
  
  constructor(private http: HttpClient) { }

  getWeekCards():Observable<IWeekCards>{
    return this.http.get<IWeekCards>(`${environment.API}dashboard/weekcards`,{headers:this.headers});
  }

  getIncomesByCategory():Observable<IExpenseIncomeByCategory[]>{
    return this.http.get<IExpenseIncomeByCategory[]>(`${environment.API}dashboard/incomes-by-category-week`, {headers: this.headers});
  }

  getExpensesByCategory():Observable<IExpenseIncomeByCategory[]>{
    return this.http.get<IExpenseIncomeByCategory[]>(`${environment.API}dashboard/expenses-by-category-week`, {headers: this.headers});
  }

  getMonthCards():Observable<IMonthCards>{
    return this.http.get<IMonthCards>(`${environment.API}dashboard/monthCards`, {headers:this.headers});
  }

}
