import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, AnimationOptions, Animation } from 'chart.js/auto';
import { Observable, pipe } from 'rxjs';
import { IExpenseIncomeByCategory } from 'src/app/interfaces/IIncomeByCategory';
import { ITransaction } from 'src/app/interfaces/ITransaction';
import { IWeekCards } from 'src/app/interfaces/IWeekCards';
import { AuthService } from 'src/app/services/auth.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  constructor(private dashboardService: DashboardService, 
              private transactionService: TransactionService,
              public ref:ChangeDetectorRef,
              private notifierService: NotifierService){
    
  }
  ngOnInit(){
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
    this.weekCards$.subscribe({
      next: response => {
        this.weekCards = response;
        this.ref.detectChanges(); 
      },
      error: err =>{
        this.notifierService.ShowError(err.error.message);
      }
    });

    //gets week incomes by category
    this.weekIncomes$.subscribe({
      next: response =>{
        this.weekIncomes = response;
        if(this.weekIncomes.length)
          this.generateIncomeChart();
        this.ref.detectChanges()
      },
      error: err =>{
        this.notifierService.ShowError(err.error.message);
      }
    });

    //gets week expenses by category
    this.weekExpenses$.subscribe({
      next: response =>{
        this.weekExpenses = response;
        if(this.weekExpenses.length)
          this.generateExpenseChart();
        this.ref.detectChanges()
      },
      error: err =>{
        this.notifierService.ShowError(err.error.message);
      }
    });

    //get 8 latest transactions
    this.recentTransactions$.subscribe({
      next:response =>{
        this.recentTransactions = response.results;
        console.log("HOME: "+response.results);
        this.ref.detectChanges();
      },
      error: err =>{
        this.notifierService.ShowError(err.error.message);
      }
    });

    
  }
}
