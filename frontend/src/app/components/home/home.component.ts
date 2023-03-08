import { Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, AnimationOptions, Animation } from 'chart.js/auto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @ViewChild("chartCanvas", {static: true}) element2!: ElementRef;
  @ViewChild("chartCanvas2", {static: true}) element!: ElementRef;

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
