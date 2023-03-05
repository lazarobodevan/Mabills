import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-side-bar-item',
  templateUrl: './side-bar-item.component.html',
  styleUrls: ['./side-bar-item.component.css']
})
export class SideBarItemComponent {
  @Input() selected!: boolean;
  @Input() text: string = "";
  @Input() icon: string = "";
}
