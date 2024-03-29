import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { startWith } from 'rxjs';
import { ICategory } from 'src/app/interfaces/ICategory';
import { ITransaction } from 'src/app/interfaces/ITransaction';
import { ITransactionRequest } from 'src/app/interfaces/ITransactionRequest';
import { CategoryService } from 'src/app/services/category.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  
  transaction =  {isPaid:false} as ITransactionRequest;
  categories = [] as ICategory[];
  category = {} as ICategory;
  isSubmitted: boolean = false;

  categories$ = this.categoryService.getCategories();
  transaction$ = this.transactionService.createTransaction(this.transaction);

  @Input() parentComponent: string = 'expenses'  
  @Input() inputTransaction = {} as ITransaction;
  @Input() inputCategory = {} as ICategory;
  @Output() public clickedOutside = new EventEmitter();

  constructor(private categoryService: CategoryService, 
              private transactionService: TransactionService, 
              private ref: ChangeDetectorRef,
              private notifierService:NotifierService){
  }

  ngOnChanges(){
    this.initializeTransactionByInput();
    this.initializeCategoryByInput();
  }

  ngOnInit(){
    this.getCategories();
  }

  clickOutside(event:any){
    if(event.target.className === "container"){
      this.transaction = {} as ITransactionRequest;
      this.inputCategory = {} as ICategory;
      this.clickedOutside.emit();
    }
  }

  getCategories(){
    this.categories$.subscribe({
      next: response =>{
        this.categories = response;
        this.ref.detectChanges();
      },
      error: err =>{
        this.notifierService.ShowError(err.error.message);
      }
    })
  }

  setIsPaid(){
    this.transaction.isPaid = !this.transaction.isPaid;
  }

  setType(event:any){
    this.transaction.type = event.target.value;
    if(this.transaction.type === "EXPENSE"){
      this.transaction['isPaid'] = false;
    }
  }

  setCategory(event:any){
    this.transaction.categoryId = event.target.value;
  }

  setValue(event:any){
    this.transaction.value = event;
  }

  setDate(event:any){
    this.transaction.date = moment(event).toDate();
  }

  setCategoryName(event:any){
    this.category.name = event;
  }
  setCategoryColor(event:any){
    this.category.color = event;
  }

  initializeTransactionByInput(){
    if(this.inputTransaction._id)
      this.transaction = {
        _id: this.inputTransaction._id,
        date: this.inputTransaction.date,
        name: this.inputTransaction.name,
        type: this.inputTransaction.type,
        value: this.inputTransaction.value,
        isPaid: this.inputTransaction.isPaid,
        categoryId: this.inputTransaction.categoryId._id!
      }
  }

  initializeCategoryByInput(){
    if(this.inputCategory._id)
      this.category = {
        _id: this.inputCategory._id,
        name: this.inputCategory.name,
        color: this.inputCategory.color
      }
  }

  addTransaction(){

    if(this.validateForm()) return;

    this.isSubmitted = true;
    if(this.transaction.type === 'INCOME'){
      Reflect.deleteProperty(this.transaction, 'isPaid');
    }
    this.transactionService.createTransaction(this.transaction).subscribe({
      next: response=>{
        this.clickedOutside.emit(true);
        this.isSubmitted = false;
        this.transaction = {} as ITransactionRequest;
        this.notifierService.ShowSuccess("Transação criada com sucesso")
        this.isSubmitted = false;
      },
      error: err =>{
        this.isSubmitted = false;
        err.error.forEach((error:string) =>{
          this.notifierService.ShowError(error);  
        });
        this.ref.detectChanges();
        this.isSubmitted = false;
        
      }
    })
  }

  updateTransaction(){

    if(this.validateForm()) return;

    this.isSubmitted = true;
    if(this.transaction.type === 'INCOME'){
      Reflect.deleteProperty(this.transaction, 'isPaid');
    }
    this.transactionService.updateTransaction(this.transaction).subscribe({
      next: response=>{
        this.clickedOutside.emit(true);
        this.isSubmitted = false;
        this.transaction = {} as ITransactionRequest;
        this.notifierService.ShowSuccess("Transação atualizada com sucesso")
        this.isSubmitted = false;
      },
      error: err =>{
        this.isSubmitted = false;
        err.error.forEach((error:string) =>{
          this.notifierService.ShowError(error);  
        });
        this.ref.detectChanges();
        this.isSubmitted = false;
      }
    });
  }

  createCategory(){

    if(this.validateForm()) return;

    this.isSubmitted = true;
    this.categoryService.createCategory(this.category).subscribe({
      next: response =>{
        this.clickedOutside.emit(true);
        this.isSubmitted = false;
        this.category = {} as ICategory;
        this.ref.detectChanges();
        this.notifierService.ShowSuccess("Categoria criada com sucesso")
        this.isSubmitted = false;
      },
      error: err =>{
        this.isSubmitted = false;
        err.error.forEach((error:string) =>{
          this.notifierService.ShowError(error);  
        });
        this.ref.detectChanges();
        this.isSubmitted = false;
      }
    });
  }

  updateCategory(){

    if(this.validateForm()) return;

    this.isSubmitted = true;
    this.categoryService.updateCategory(this.category).subscribe({
      next: response =>{
        this.clickedOutside.emit(true);
        this.isSubmitted = false;
        this.inputCategory = {} as ICategory;
        this.notifierService.ShowSuccess('Categoria atualizada com sucesso');
        this.isSubmitted = false;
      },
      error: err =>{
        this.isSubmitted = false;
        this.notifierService.ShowError(err.error.message);
      }
    })
  }

  validateForm(){
    let isMissingField = false;
    if(this.parentComponent === 'expenses'){
      if(!this.transaction.name){
        this.notifierService.ShowError('Nome é obrigatório');
        isMissingField = true;
      }
      if(!this.transaction.type){
        this.notifierService.ShowError('Tipo é obrigatório');
        isMissingField = true;
      }
      if(!this.transaction.categoryId){
        this.notifierService.ShowError('Categoria é obrigatória');
        isMissingField = true;
      }
      if(!this.transaction.value){
        this.notifierService.ShowError('Valor é obrigatório');
        isMissingField = true;
      }
      if(!this.transaction.date){
        this.notifierService.ShowError('Data é obrigatória');
        isMissingField = true;
      }
    }else{
      if(!this.category.name){
        this.notifierService.ShowError('Nome é obrigatório');
        isMissingField = true;
      }
      if(!this.category.color){
        this.notifierService.ShowError('Cor é obrigatória');
        isMissingField = true;
      }
    }
    return isMissingField;
  }

}
