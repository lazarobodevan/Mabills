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
  @Input() inputValue: any = '';
  @Input() width: string = '300px';
  
  @Output() inputContentEmitter: EventEmitter<any> = new EventEmitter();

  ngOnChanges(){
    if(this.isDate()){
      let date = moment(this.inputValue, 'DD/MM/YYYY').format('YYYY-MM-DD');
      if(date === "Invalid date"){
        this.inputValue = '';
      }else{
        this.inputValue = date;
      }
    }
  }

  sendContent(){
    if(this.type === "date"){
      let date = moment(this.content, 'YYYY,MM,DD');
      if(isNaN(date.toDate().getDate())){
        return this.inputContentEmitter.emit('');
      }
      this.inputContentEmitter.emit(date.toDate());
      return;
    }
    this.inputContentEmitter.emit(this.content);
  }

  isDate(){
    return this.inputValue instanceof Date;
  }
}
