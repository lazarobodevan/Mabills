import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { ICategory } from 'src/app/interfaces/ICategory';
import { ITransactionRequest } from 'src/app/interfaces/ITransactionRequest';
import { CategoryService } from 'src/app/services/category.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {

  categories$ = this.categoryService.getCategories();

  categories = [] as ICategory[];
  transaction =  {} as ITransactionRequest;

  constructor(private categoryService: CategoryService, private transactionService: TransactionService){
    this.getCategories();
  }

  @Output() public clickedOutside = new EventEmitter();

  clickOutside(event:any){
    if(event.target.className === "container"){
      this.clickedOutside.emit();
      console.log("emitiu")
    }
  }

  getCategories(){
    this.categories$.subscribe(response =>{
      this.categories = response;
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

  addTransaction(){
    if(this.transaction.type === 'INCOME'){
      Reflect.deleteProperty(this.transaction, 'isPaid');
    }
    this.transactionService.createTransaction(this.transaction).subscribe(response=>{
      console.log(response);
    })
  }

}
