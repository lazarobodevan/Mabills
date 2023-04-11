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
  
  @Output() inputContent: EventEmitter<string> = new EventEmitter();

  ngOnChanges(){
    if(typeof this.inputValue === 'string' && this.isDate()){
      let date = moment(this.inputValue, 'DD/MM/YYYY').format('YYYY-MM-DD');
      if(date === "Invalid date"){
        console.log(date);
        this.inputValue = '';
      }else{
        this.inputValue = date;
      }
    }
    
  }

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

  isDate(){
    return this.inputValue.match(/^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/)
  }
}
