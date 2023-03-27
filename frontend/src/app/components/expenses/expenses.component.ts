import { Component } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ITransaction } from 'src/app/interfaces/ITransaction';
import { ITransactionResponse } from 'src/app/interfaces/ITransactionResponse';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent {

  transactions = [] as ITransaction[];
  nextURL: string = '?limit=5&offset=0';

  transactions$!: Observable<ITransactionResponse>;
  
  isModalVisible: boolean = false;

  constructor(private transactionService: TransactionService){
    this.loadTransaction();
  }

  loadTransaction(){
      if(!this.nextURL) return
      this.transactions$ = this.transactionService.getTransactions(this.nextURL);
      this.transactions$.subscribe(response =>{
      response.results.forEach(item =>{
        item.date = moment.utc(item.date).format('DD/MM');
        this.transactions.push(item);
      })
      this.nextURL = response.nextUrl;
    })
  }

  toggleModal(){
    this.isModalVisible = !this.isModalVisible;
  }


}
