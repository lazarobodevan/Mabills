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
  @Input() variation: number = 0;

  defineVariation(){
    if(this.variation > 0){
      return {
        class: 'positive',
        icon: 'arrow_drop_up'
      }
    }else if(this.variation < 0){
      return {
        class: 'negative',
        icon: 'arrow_drop_down'
      }
    }else{
      return {
        class: 'neutral',
        icon: 'remove'
      }
    }
  }
}
