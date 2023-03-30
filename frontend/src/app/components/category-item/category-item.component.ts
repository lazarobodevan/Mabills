import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.css']
})
export class CategoryItemComponent {
  @Input() name: string = '';
  @Input() backgroundColor = 'rgba(59, 77, 255, 0.52)';
}
