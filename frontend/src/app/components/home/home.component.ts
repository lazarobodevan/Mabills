import { Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, AnimationOptions, Animation } from 'chart.js/auto';
import { Observable, pipe } from 'rxjs';
import { IExpenseIncomeByCategory } from 'src/app/interfaces/IIncomeByCategory';
import { IWeekCards } from 'src/app/interfaces/IWeekCards';
import { AuthService } from 'src/app/services/auth.service';
import { DashboardService } from 'src/app/services/dashboard.service';

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

  weekCards = {} as IWeekCards;
  weekIncomes: IExpenseIncomeByCategory[] = [];
  weekExpenses: IExpenseIncomeByCategory[] = [];

  constructor(private dashboardService: DashboardService){
    this.dashboardService.getWeekCards().subscribe(response => this.weekCards = response);
    this.dashboardService.getIncomesByCategory().subscribe(response =>{
        this.weekIncomes = response;
        if(this.weekIncomes.length)
          this.generateIncomeChart();
      }
    );
    this.dashboardService.getExpensesByCategory().subscribe(response =>{
      this.weekExpenses = response;
      if(this.weekExpenses.length)
        this.generateExpenseChart();
    })
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
}
