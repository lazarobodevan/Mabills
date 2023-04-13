import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { IExpenseIncomeByCategory } from 'src/app/interfaces/IIncomeByCategory';
import { IMonthCards } from 'src/app/interfaces/IMonthCards';
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

  constructor(private dashboardService:DashboardService, private notifierService: NotifierService, private ref:ChangeDetectorRef){
    Chart.defaults.borderColor = "rgba(255, 255, 255, 0.22)";
    Chart.defaults.color = "#FFFFFF"
    this.loadDashboardPage()
  }

  loadDashboardPage(){
    this.getMonthCards();
    this.dashboardService.getMonthIncomesByCategory().subscribe({
      next: response =>{
        this.monthIncomesByCategory = response;
        this.generateIncomeChart();
        this.generateTransactionsLineChart()
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
    
    //this.generateTransactionsLineChart();
    //this.generateIncomeChart();
    //this.generateExpenseChart();
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
        labels: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho'],
	       datasets: [
          {
            label: 'Receita',
            data: [1467,276, 1157, 2229, 1092,
								 1574, 1573, 1576],
            borderColor: 'green',
            backgroundColor: 'green'
          },
          {
            label: 'Despesa',
            data: ['467','576', '572', '79', '92',
								 '574', '573', '576'],
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
          return item._id.name;
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
          return item._id.name
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
