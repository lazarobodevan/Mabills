import { Component, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @ViewChild("chartCanvas", {static: true}) element!: ElementRef;
  @ViewChild("chartCanvas2", {static: true}) element2!: ElementRef;

  ngOnInit(){
    new Chart(this.element.nativeElement,{
      type:'doughnut',
      data:{
        datasets:[{
          data:[10,20,20,30]
        }]
      }
    })

    new Chart(this.element2.nativeElement,{
      type:'doughnut',
      data:{
        datasets:[{
          data:[1,2,20,30]
        }]
      }
    })
  }
}
