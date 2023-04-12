import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotifierService {

  constructor(private toast: ToastrService) { }

  ShowSuccess(text?:string){
    this.toast.success(text, "Sucesso");
  }
  ShowError(text?:string){
    this.toast.error(text,"Erro");
  }
}
