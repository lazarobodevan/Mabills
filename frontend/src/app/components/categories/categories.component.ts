import { Component } from '@angular/core';
import { ICategory } from 'src/app/interfaces/ICategory';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {

  categories = [] as ICategory[];

  constructor(private categoryService: CategoryService){
    this.getCategories();
  }

  getCategories(){
    this.categoryService.getCategories().subscribe(response =>{
      this.categories = response;
    });
  }
}
