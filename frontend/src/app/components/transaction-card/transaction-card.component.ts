import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-transaction-card',
  templateUrl: './transaction-card.component.html',
  styleUrls: ['./transaction-card.component.css']
})
export class TransactionCardComponent {
  @Input() name: string = '';
  @Input() value: number = 0;
  @Input() date: string = '';
  @Input() backgroundcolor: string = 'blue';
}
