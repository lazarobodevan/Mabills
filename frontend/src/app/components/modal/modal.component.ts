import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ICategory } from 'src/app/interfaces/ICategory';
import { ITransaction } from 'src/app/interfaces/ITransaction';
import { ITransactionRequest } from 'src/app/interfaces/ITransactionRequest';
import { CategoryService } from 'src/app/services/category.service';
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

  constructor(private categoryService: CategoryService, private transactionService: TransactionService, private ref: ChangeDetectorRef){
    this.getCategories()
  }

  ngOnChanges(){
    this.initializeTransactionByInput();
  }

  clickOutside(event:any){
    if(event.target.className === "container"){
      this.transaction = {} as ITransactionRequest;
      this.inputCategory = {} as ICategory;
      this.clickedOutside.emit();
    }
  }

  getCategories(){
    this.categories$.subscribe(response =>{
      this.categories = response;
      this.ref.detectChanges();
    })
  }

  setIsPaid(){
    this.transaction.isPaid = !this.transaction.isPaid;
  }

  setType(event:any){
    this.transaction.type = event.target.value;
  }

  setCategory(event:any){
    this.transaction.categoryId = event.target.value;
  }

  setValue(event:any){
    this.transaction.value = event;
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

  addTransaction(){
    this.isSubmitted = true;
    if(this.transaction.type === 'INCOME'){
      Reflect.deleteProperty(this.transaction, 'isPaid');
    }
    this.transactionService.createTransaction(this.transaction).subscribe(response=>{
      this.clickedOutside.emit(true);
      this.isSubmitted = false;
      this.transaction = {} as ITransactionRequest;
    })
  }

  updateTransaction(){
    this.isSubmitted = true;
    this.transactionService.updateTransaction(this.transaction).subscribe(response=>{
      this.clickedOutside.emit(true);
      this.isSubmitted = false;
      this.transaction = {} as ITransactionRequest;
    });
  }

  createCategory(){
    this.isSubmitted = true;
    this.categoryService.createCategory(this.category).subscribe(response =>{
      this.clickedOutside.emit(true);
      this.isSubmitted = false;
      this.category = {} as ICategory;
      this.ref.detectChanges();
    });
  }

}
