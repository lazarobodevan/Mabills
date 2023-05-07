import { Component } from '@angular/core';
import { IUser} from 'src/app/interfaces/IUser';
import { AuthService } from 'src/app/services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'src/app/services/notifier.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  private user = {} as IUser;

  isSubmitted: boolean = false;

  constructor(private authService: AuthService, private router: Router, private notifierService: NotifierService){
  }

  setEmail(email:string){
    this.user.email = email;
  }
  setPassword(password:string){
    this.user.password = password;
  }

  login(){

    if(this.validateForm()) return;
    this.isSubmitted = true;
    this.authService.authenticate(this.user).subscribe({
      error: err =>{
        if(err.error.length){
          err.error.forEach((error:string) =>{
            if(error === '\"email\" must be a valid email')
              this.notifierService.ShowError('Email deve ser válido')
            else
              this.notifierService.ShowError(error);    
          })
        }else{
          if(err.error.message === 'Incorrect email or password')
            this.notifierService.ShowError('Email ou senha incorretos');
          else
            this.notifierService.ShowError(err.error.message);
        }
      },
    });
    this.isSubmitted = false;
  }

  signUpRedirect(){
    this.router.navigate(['/signup'])
  }

  validateForm(){
    let isMissingField = false;
    if(!this.user.email){
      this.notifierService.ShowError('Email é obrigatório');
      isMissingField = true;
    }
    if(!this.user.password){
      this.notifierService.ShowError('Senha é obrigatória');
      isMissingField = true;
    }
    return isMissingField;
  }

}
