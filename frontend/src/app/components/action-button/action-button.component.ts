import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.css']
})
export class ActionButtonComponent {
  @Input() text: string = "";
  @Input() width: string = "";

  @Output() OnClick = new EventEmitter<string>();
  
  EmitEvent(){
    this.OnClick.emit();
  }
}
