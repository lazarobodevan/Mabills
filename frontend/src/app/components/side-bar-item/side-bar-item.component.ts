import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-side-bar-item',
  templateUrl: './side-bar-item.component.html',
  styleUrls: ['./side-bar-item.component.css']
})
export class SideBarItemComponent {
  @Input() text: string = "";
  @Input() icon: string = "";
  @Input() routLink: string = ""

}
