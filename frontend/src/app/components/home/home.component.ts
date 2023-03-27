import { Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, AnimationOptions, Animation } from 'chart.js/auto';
import { Observable, pipe } from 'rxjs';
import { IExpenseIncomeByCategory } from 'src/app/interfaces/IIncomeByCategory';
import { ITransaction } from 'src/app/interfaces/ITransaction';
import { IWeekCards } from 'src/app/interfaces/IWeekCards';
import { AuthService } from 'src/app/services/auth.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @ViewChild("incomeChart", {static: true}) incomeChart!: ElementRef;
  @ViewChild("expenseChart", {static: true}) expenseChart!: ElementRef;

  weekCards$ = this.dashboardService.getWeekCards();
  weekIncomes$ = this.dashboardService.getIncomesByCategory();
  weekExpenses$ = this.dashboardService.getExpensesByCategory();
  recentTransactions$ = this.transactionService.getTransactions("?limit=8");

  weekCards = {} as IWeekCards;
  weekIncomes: IExpenseIncomeByCategory[] = [];
  weekExpenses: IExpenseIncomeByCategory[] = [];
  recentTransactions: ITransaction[] = [];

  constructor(private dashboardService: DashboardService, private transactionService: TransactionService){
    this.loadHomePage();
  }

  generateIncomeChart(){
    new Chart(this.incomeChart.nativeElement,{
      type:'doughnut',
      data: {// values on X-Axis
        labels: this.weekIncomes.map(item =>{
          return item._id.name
        }),
	       datasets: [
          {
            data: this.weekIncomes.map(item=>{
              return item.SUM;
            }),
            backgroundColor: this.weekIncomes.map(item =>{
              return item._id.color
            })
          },
        ]
      },
    });
  }
  
  generateExpenseChart(){
    
    new Chart(this.expenseChart.nativeElement,{
      type:'doughnut',
      data: {
        labels: this.weekExpenses.map(item =>{
          return item._id.name;
        }),
        datasets: [
          {
            data: this.weekExpenses.map(item=>{
              return item.SUM;
            }),
            backgroundColor: this.weekExpenses.map(item =>{
              return item._id.color
            })
          },
        ]
      },
    })
  }

  loadHomePage(){

    //get week cards
    this.weekCards$.subscribe(response => this.weekCards = response);

    //gets week incomes by category
    this.weekIncomes$.subscribe(response =>{
        this.weekIncomes = response;
        if(this.weekIncomes.length)
          this.generateIncomeChart();
      }
    );

    //gets week expenses by category
    this.weekExpenses$.subscribe(response =>{
      this.weekExpenses = response;
      if(this.weekExpenses.length)
        this.generateExpenseChart();
    });

    //get 8 latest transactions
    this.recentTransactions$.subscribe(response =>{
      this.recentTransactions = response.results;
    })
  }
}
