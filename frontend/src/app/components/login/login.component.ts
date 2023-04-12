import { Component } from '@angular/core';
import { IUser} from 'src/app/interfaces/IUser';
import { AuthService } from 'src/app/services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  private user = {} as IUser;

  constructor(private authService: AuthService, private router: Router){
  }

  setEmail(email:string){
    this.user.email = email;
  }
  setPassword(password:string){
    this.user.password = password;
  }

  login(){
    this.authService.authenticate(this.user).subscribe();
  }

  signUpRedirect(){
    this.router.navigate(['/signup'])
  }

}
