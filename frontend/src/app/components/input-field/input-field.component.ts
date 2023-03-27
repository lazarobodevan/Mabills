import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.css']
})
export class InputFieldComponent {
  
  content: string = '';

  @Input() placeholder: string = '';
  @Input() type: string = '';
  @Input() icon: string = '';
  

  @Output() inputContent: EventEmitter<string> = new EventEmitter();
  sendContent(){
    if(this.type === "date"){
      this.inputContent.emit(moment(this.content, 'YYYY,mm,DD').format('DD/mm/YYYY'));
      return;
    }
    this.inputContent.emit(this.content);
  }
}
