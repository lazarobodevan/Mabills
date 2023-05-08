import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { IUser} from 'src/app/interfaces/IUser';
import { AuthService } from 'src/app/services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'src/app/services/notifier.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  private user = {} as IUser;

  isSubmitted: boolean = false;

  constructor(private authService: AuthService, 
              private router: Router, 
              private notifierService: NotifierService,
              private ref:ChangeDetectorRef){
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
              this.notifierService.ShowError(error);    
          })
        }else{
          if(err.error.message === 'Incorrect email or password')
            this.notifierService.ShowError('Email ou senha incorretos');
          else
            this.notifierService.ShowError(err.error.message);
        }
        this.isSubmitted = false;
        this.ref.detectChanges();
      },
    });
    
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
    if(this.user.email && !this.isEmailValid()){
      this.notifierService.ShowError('Email deve ser válido');
      isMissingField = true;
    }
    if(!this.user.password){
      this.notifierService.ShowError('Senha é obrigatória');
      isMissingField = true;
    }
    return isMissingField;
  }

  isEmailValid(){
    return  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.user.email);
  }

}
