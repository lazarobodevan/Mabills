import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Component } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ICategory } from 'src/app/interfaces/ICategory';
import { IFilter } from 'src/app/interfaces/IFilter';
import { ITransaction } from 'src/app/interfaces/ITransaction';
import { ITransactionResponse } from 'src/app/interfaces/ITransactionResponse';
import { CategoryService } from 'src/app/services/category.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpensesComponent {

  transactions = [] as ITransaction[];
  nextURL: string = '';
  categories = [] as ICategory[];
  filter = {} as IFilter;
  selectedTransaction = {} as ITransaction;

  transactions$!: Observable<ITransactionResponse>;
  categories$ = this.categoryService.getCategories();
  
  isModalVisible: boolean = false;
  isFilterChanged: boolean = false;
  isLoading: boolean = false;

  constructor(private transactionService: TransactionService, 
              private categoryService: CategoryService,
              public ref:ChangeDetectorRef,
              private notifierService: NotifierService){

    this.loadTransaction();
    this.getCategories();

  }

  loadTransaction(){
    this.isLoading = true;
    this.selectedTransaction = {} as ITransaction;
    if(this.isFilterChanged){
      this.transactions = [];
      this.nextURL = '';
    }
    this.transactions$ = this.transactionService.getTransactions(this.nextURL?this.nextURL : '', this.filter);
    
    this.transactions$.subscribe(response =>{
      response.results.forEach(item =>{
        item.date = moment.utc(item.date).toDate();
        this.transactions.push(item);
      })
      this.nextURL = response.nextUrl;
      this.isFilterChanged = false;
      this.isLoading  = false;
      this.ref.detectChanges();
    })
  }

  getCategories(){
    this.categories$.subscribe({
      next: response =>{
        this.categories = response;
      },
      error: err =>{
        this.notifierService.ShowError(err.error.message)
      }
    })
  }

  setCategoryFilter(event:any){
    this.filter.categoryId = event.target.value;
    if(event.target.value === ''){
      Reflect.deleteProperty(this.filter, 'categoryId')
    }
    this.isFilterChanged = true;
    this.loadTransaction();
  }
  setTypeFilter(event:any){
    this.filter.type = event.target.value;
    if(event.target.value === ''){
      Reflect.deleteProperty(this.filter, 'type')
    }
    this.isFilterChanged = true;
    this.loadTransaction();
  }
  setNameFilter(event:any){
    this.filter.name = event;
    console.log(this.filter)
    if(event === ''){
      Reflect.deleteProperty(this.filter, 'name')
    }
    this.isFilterChanged = true;
    this.loadTransaction();
  }
  setDateFilter(event:any){
    this.filter.date = event;
    if(event === ''){
      Reflect.deleteProperty(this.filter, 'date')
    }
    this.isFilterChanged = true;
    this.loadTransaction();
  }

  setSelectedTransaction(transaction:ITransaction){
    this.selectedTransaction = transaction;
  }

  deleteTransaction(){
    this.transactionService.deleteTransaction(this.selectedTransaction._id!).subscribe({
      next: response=>{
        this.selectedTransaction = {} as ITransaction;
        this.isFilterChanged = true;
        this.loadTransaction();
        this.ref.detectChanges();
        this.notifierService.ShowSuccess("Transação deletada com sucesso")
      },
      error: err =>{
        this.notifierService.ShowError(err.error.message);
      }

    })
  }

  editTransaction(){
    this.selectedTransaction = Object.assign({}, this.selectedTransaction);
    this.toggleModal();
  }

  createTransaction(event?:any){
    this.selectedTransaction = {} as ITransaction;
    this.toggleModal(event);
  }

  toggleModal(event?:any){
    if(event === true){
      this.isFilterChanged = true;
      this.loadTransaction();
    }
    this.isModalVisible = !this.isModalVisible;
  }


}
