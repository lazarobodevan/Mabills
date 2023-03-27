import { Component } from '@angular/core';
import { ITransaction } from 'src/app/interfaces/ITransaction';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent {

  transactions$ = this.transactionService.getTransactions("");
  
  transactions = [] as ITransaction[];
  nextURL: string = 'first';

  isModalVisible: boolean = true;

  constructor(private transactionService: TransactionService){
    this.loadTransaction();
  }

  loadTransaction(){
    if(this.nextURL === 'first'){
      this.transactions$.subscribe(response =>{
        this.transactions = response.results;
        this.nextURL = response.nextUrl;
      })
    }
  }

  toggleModal(){
    this.isModalVisible = !this.isModalVisible;
    console.log("alo")
  }


}
