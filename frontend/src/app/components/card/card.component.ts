import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() icon: string = '';
  @Input() text: string = '';
  @Input() value: number = 0;
  @Input() backgroundColor: string = 'blue';
}
