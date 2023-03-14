import { Component, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  @ViewChild("chartCanvas", {static: true}) element!: ElementRef;
  @ViewChild("income", {static: true}) incomeChart!: ElementRef;
  @ViewChild("expense", {static: true}) expenseChart!: ElementRef;

  ngOnInit(){
    Chart.defaults.borderColor = "rgba(255, 255, 255, 0.22)";
    Chart.defaults.color = "#FFFFFF"
    this.generateIncomeExpesesChart();
    this.generateIncomeChart();
    this.generateExpenseChart();
  }

  generateIncomeExpesesChart(){
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
	       datasets: [
          {
            label: "Sales",
            data: ['467','576', '572', '79', '92',
								 '574', '573', '576'],
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
	       datasets: [
          {
            label: "Sales",
            data: ['467','576', '572', '79', '92',
								 '574', '573', '576'],
          },
        ]
      },
    })
  }

}
