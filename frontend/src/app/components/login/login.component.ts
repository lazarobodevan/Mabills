import { Component } from '@angular/core';
import { User } from 'src/app/classes/User';
import { AuthService } from 'src/app/services/auth.service';
import { FormsModule } from '@angular/forms';

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
  }
  setPassword(password:string){
    this.user.password = password;
  }

  login(){
    this.authService.authenticate(this.user);
  }

  ngOnChange(){
    console.log('a')
  }

}
