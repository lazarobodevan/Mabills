import { Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, AnimationOptions, Animation } from 'chart.js/auto';
import { Observable, pipe } from 'rxjs';
import { IIncomeByCategory } from 'src/app/interfaces/IIncomeByCategory';
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

  weekCards = {} as IWeekCards;
  weekIncomes: IIncomeByCategory[] = [];

  constructor(private dashboardService: DashboardService){
    this.dashboardService.getWeekCards().subscribe(response => this.weekCards = response);
    this.dashboardService.getIncomesByCategory().subscribe(response =>{
        this.weekIncomes = response;
        this.generateIncomeChart();
      }
    );
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
          },
        ]
      },
    });
  }


  ngOnInit(){

    

    new Chart(this.expenseChart.nativeElement,{
      type:'doughnut',
      data: {
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
