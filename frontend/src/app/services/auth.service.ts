import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../classes/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isUserAuthenticated: boolean = false;
  constructor(private router: Router) { }

  //implementar logica
  authenticate(user: User){
    if(user.email === 'teste@teste.com'){
      console.log("chamou");
      this.isUserAuthenticated = true;
      this.router.navigate(['/home']);
    }else{
      this.isUserAuthenticated = false;
    }
  }

}
