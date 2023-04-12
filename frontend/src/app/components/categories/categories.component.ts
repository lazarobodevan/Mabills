import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ICategory } from 'src/app/interfaces/ICategory';
import { CategoryService } from 'src/app/services/category.service';
import { NotifierService } from 'src/app/services/notifier.service';

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
              private ref:ChangeDetectorRef,
              private notifierService:NotifierService){
    this.getCategories();
  }

  getCategories(){
    this.getCategories$.subscribe({
      next: response =>{
        this.categories = response;
        this.ref.detectChanges()
      },
      error: err =>{
        this.notifierService.ShowError(err.error.message);
      }
    });
  }

  createCategory(event: any){
    this.categorySelected = {} as ICategory;
    this.toggleModal(event);
  }

  deleteCategory(event:ICategory){
    this.categoryService.deleteCategory(event).subscribe(
      (response)=>{
        this.getCategories();
        this.ref.detectChanges();
        this.notifierService.ShowSuccess("Categoria deletada com sucesso")
      },
      (error)=>{
        this.notifierService.ShowError(error.error.message);
      }
    )
  }

  toggleModal(event?:any){
    if(event){
      this.categorySelected = event;
      this.getCategories();
    }
    this.isModalVisible = !this.isModalVisible;
  }
}
