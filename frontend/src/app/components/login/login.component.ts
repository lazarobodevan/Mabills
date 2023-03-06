import { Component } from '@angular/core';
import { User } from 'src/app/classes/User';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  private user: User = new User();

  constructor(private authService: AuthService){

  }

  setEmail(email:string){
    this.user.email = email;
    console.log(this.user);
  }
  setPassword(password:string){
    this.user.password = password;
  }

  login(){
    console.log(this.user);
    //this.authService.authenticate(this.user);
  }

}
