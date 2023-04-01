import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICategory } from 'src/app/interfaces/ICategory';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.css']
})
export class CategoryItemComponent {

  @Input() category = {} as ICategory;
  @Output() OnClick: EventEmitter<ICategory> = new EventEmitter();

  constructor(private categoryService: CategoryService){}

  click(){
    this.OnClick.emit(this.category);
  }

}