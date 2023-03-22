import { Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, AnimationOptions, Animation } from 'chart.js/auto';
import { Observable, pipe } from 'rxjs';
import { IWeekCards } from 'src/app/interfaces/IWeekCards';
import { AuthService } from 'src/app/services/auth.service';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @ViewChild("chartCanvas", {static: true}) element2!: ElementRef;
  @ViewChild("chartCanvas2", {static: true}) element!: ElementRef;

  weekCards$ = this.dashboardService.getWeekCards();
  weekCards = {} as IWeekCards;

  constructor(private dashboardService: DashboardService){
    this.weekCards$ = this.dashboardService.getWeekCards();
    this.dashboardService.getWeekCards().subscribe(response => this.weekCards = response);
  }


  ngOnInit(){

    new Chart(this.element.nativeElement,{
      type:'doughnut',
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

    new Chart(this.element2.nativeElement,{
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
