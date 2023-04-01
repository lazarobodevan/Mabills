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
  categorySelected = {} as ICategory;
  isModalVisible: boolean = false;

  getCategories$ = this.categoryService.getCategories();

  constructor(private categoryService: CategoryService){
    this.getCategories();
  }

  getCategories(){
    this.getCategories$.subscribe(response =>{
      this.categories = response;
    });
  }

  toggleModal(event?:any){
    if(event){
      this.categorySelected = event;
    }
    this.isModalVisible = !this.isModalVisible;
  }
}
