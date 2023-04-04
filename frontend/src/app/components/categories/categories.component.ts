import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ICategory } from 'src/app/interfaces/ICategory';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesComponent {

  categories = [] as ICategory[];
  categorySelected = {} as ICategory;
  isModalVisible: boolean = false;

  getCategories$ = this.categoryService.getCategories();

  constructor(private categoryService: CategoryService,
              public ref:ChangeDetectorRef){
    this.getCategories();
  }

  getCategories(){
    this.getCategories$.subscribe(response =>{
      this.categories = response;
      this.ref.detectChanges()
    });
  }

  createCategory(event: any){
    this.categorySelected = {} as ICategory;
    this.toggleModal(event);
  }


  toggleModal(event?:any){
    if(event){
      this.categorySelected = event;
      this.getCategories();
    }
    this.isModalVisible = !this.isModalVisible;
  }
}
