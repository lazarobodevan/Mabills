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
  isSubmitted:boolean = false;

  getCategories$ = this.categoryService.getCategories();

  constructor(private categoryService: CategoryService,
              private ref:ChangeDetectorRef,
              private notifierService:NotifierService){
    
  }

  ngOnInit(){
    this.getCategories();
  }

  getCategories(){
    this.isSubmitted = true
    this.getCategories$.subscribe({
      next: response =>{
        this.categories = response;
        this.isSubmitted = false;
        this.ref.reattach()
        this.ref.detectChanges();
      },
      error: err =>{
        this.isSubmitted = false;
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
      console.log(this.categorySelected);
      this.getCategories();
    }
    this.isModalVisible = !this.isModalVisible;
  }
}
