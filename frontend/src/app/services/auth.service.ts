import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../classes/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isUserAuthenticated: boolean = false;

  showSideBarEmitter = new EventEmitter<boolean>();

  constructor(private router: Router) { }

  //implementar logica
  authenticate(user: User){
    if(user.email === 'teste@teste.com'){
      this.showSideBarEmitter.emit(true);

      this.isUserAuthenticated = true;
      this.router.navigate(['/home']);
    }else{
      this.showSideBarEmitter.emit(true);
      this.isUserAuthenticated = false;
    }
  }

}
