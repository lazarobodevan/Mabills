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
      let date = moment(this.content, 'YYYY,mm,DD').format('DD/mm/YYYY');
      if(date === 'Invalid date'){
        return this.inputContent.emit('');
      }
      this.inputContent.emit(date);
      return;
    }
    this.inputContent.emit(this.content);
  }
}
