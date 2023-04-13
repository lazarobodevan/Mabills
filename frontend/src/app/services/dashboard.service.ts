import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { IExpenseIncomeByCategory } from '../interfaces/IIncomeByCategory';
import { ITransaction } from '../interfaces/ITransaction';
import { IWeekCards } from '../interfaces/IWeekCards';
import { TransactionService } from './transaction.service';
import { IMonthCards } from '../interfaces/IMonthCards';
import { IYearIncomeExpense } from '../interfaces/IYearIncomeExpense';


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
    return this.http.get<IWeekCards>(`${environment.API}dashboard/week/cards`,{headers:this.headers});
  }

  getIncomesByCategory():Observable<IExpenseIncomeByCategory[]>{
    return this.http.get<IExpenseIncomeByCategory[]>(`${environment.API}dashboard/week/incomesByCategory`, {headers: this.headers});
  }

  getExpensesByCategory():Observable<IExpenseIncomeByCategory[]>{
    return this.http.get<IExpenseIncomeByCategory[]>(`${environment.API}dashboard/week/expensesByCategory`, {headers: this.headers});
  }

  getMonthCards():Observable<IMonthCards>{
    return this.http.get<IMonthCards>(`${environment.API}dashboard/month/cards`, {headers:this.headers});
  }

  getMonthIncomesByCategory():Observable<IExpenseIncomeByCategory[]>{
    return this.http.get<IExpenseIncomeByCategory[]>(`${environment.API}dashboard/month/incomesByCategory`, {headers: this.headers});
  }
  
  getMonthExpensesByCategory():Observable<IExpenseIncomeByCategory[]>{
    return this.http.get<IExpenseIncomeByCategory[]>(`${environment.API}dashboard/month/expensesByCategory`, {headers: this.headers});
  }

  getYearIncomeExpenses():Observable<IYearIncomeExpense[]>{
    return this.http.get<IYearIncomeExpense[]>(`${environment.API}dashboard/year/incomesAndExpenses`, {headers: this.headers});
  }

}
