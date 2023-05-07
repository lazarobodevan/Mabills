import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { IExpenseIncomeByCategory } from 'src/app/interfaces/IIncomeByCategory';
import { IMonthCards } from 'src/app/interfaces/IMonthCards';
import { IYearIncomeExpense } from 'src/app/interfaces/IYearIncomeExpense';
import { DashboardService } from 'src/app/services/dashboard.service';
import { NotifierService } from 'src/app/services/notifier.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  @ViewChild("chartCanvas", {static: true}) element!: ElementRef;
  @ViewChild("income", {static: true}) incomeChart!: ElementRef;
  @ViewChild("expense", {static: true}) expenseChart!: ElementRef;
  
  monthCards = {} as IMonthCards;
  monthIncomesByCategory: IExpenseIncomeByCategory[] = [];
  monthExpensesByCategory: IExpenseIncomeByCategory[] = [];
  yearIncomesExpenses: IYearIncomeExpense[] = [];
  isSubmitted:boolean = false;

  constructor(private dashboardService:DashboardService, private notifierService: NotifierService, private ref:ChangeDetectorRef){
    Chart.defaults.borderColor = "rgba(255, 255, 255, 0.22)";
    Chart.defaults.color = "#FFFFFF";
    this.loadDashboardPage()
  }

  loadDashboardPage(){

    this.isSubmitted = true;

    this.getMonthCards();
    this.dashboardService.getMonthIncomesByCategory().subscribe({
      next: response =>{
        this.monthIncomesByCategory = response;
        this.generateIncomeChart();
      },
      error: err =>{
        this.notifierService.ShowError(err.error.message);
      }
    });

    this.dashboardService.getMonthExpensesByCategory().subscribe({
      next: response =>{
        this.monthExpensesByCategory = response;
        this.generateExpenseChart();
      }
    });

    this.dashboardService.getYearIncomeExpenses().subscribe({
      next: response =>{

        this.yearIncomesExpenses = response;
        this.generateTransactionsLineChart();
        this.isSubmitted = false;
      }
    })

  }

  getMonthCards(){
    this.dashboardService.getMonthCards().subscribe({
      next: response =>{
        this.monthCards = response;
      },
      error: err =>{
        this.notifierService.ShowError(err.error.message);
      },
      complete: ()=>{
        this.ref.detectChanges();
      }
    })
  }

  generateTransactionsLineChart(){
    new Chart(this.element.nativeElement,{
      type:'line',
      options: {
        responsive: true,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Receita x Despesas'
          },
        }
      },
      data: {// values on X-Axis
        labels: ['Janeiro','Fevereiro','Março','Abril','Maio', 'Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
	       datasets: [
          {
            label: 'Receita',
            data: this.yearIncomesExpenses.map(item =>{
              return item.INCOME
            }),
            borderColor: 'green',
            backgroundColor: 'green'
          },
          {
            label: 'Despesa',
            data: this.yearIncomesExpenses.map(item =>{
              return item.EXPENSE
            }),
            borderColor: 'red',
            backgroundColor: 'red'
          },
        ]
      },
    });
  }

  generateIncomeChart(){
    new Chart(this.incomeChart.nativeElement,{
      type:'doughnut',
      options:{
        plugins: {
          title: {
            display: true,
            text: 'Fonte de receita'
          },
        }
      },
      data: {// values on X-Axis
        labels: this.monthIncomesByCategory.map(item =>{
          return item._id.name.length < 12 ? item._id.name : item._id.name.substring(0,12)+'...';
        }),
	       datasets: [
          {
            data: this.monthIncomesByCategory.map(item =>{
              return item.SUM
            }),
            backgroundColor: this.monthIncomesByCategory.map(item =>{
              return item._id.color;
            })
          },
        ]
      },
    })
  }
  generateExpenseChart(){
    new Chart(this.expenseChart.nativeElement,{
      type:'doughnut',
      options:{
        plugins: {
          title: {
            display: true,
            text: 'Fonte de despesa'
          },
        }
      },
      data: {// values on X-Axis
        labels: this.monthExpensesByCategory.map(item=>{
          return item._id.name.length < 12 ? item._id.name : item._id.name.substring(0,12)+'...';
        }),
        datasets: [
          {
            data: this.monthExpensesByCategory.map(item=>{
              return item.SUM;
            }),
            backgroundColor: this.monthExpensesByCategory.map(item =>{
              return item._id.color;
            })
          },
        ]
      },
    })
  }

}
