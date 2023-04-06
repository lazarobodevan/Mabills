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
    return this.inputValue.match(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)
  }
}
