import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/IUser';
import { NotifierService } from 'src/app/services/notifier.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  user = {} as IUser;
  confirmPassword: string = '';
  incorrectPassword: boolean = true;
  isSubmitted:boolean = false;

  constructor(private userService: UserService, 
              private notifierService: NotifierService, 
              private router: Router){}

  signUp(){

    if(this.validateForm()) return;

    this.isSubmitted = true;
    this.userService.createUser(this.user).subscribe({
      next: response =>{
        this.notifierService.ShowSuccess('Usuário criado com sucesso');;
        this.isSubmitted = false;
        this.router.navigate(['/'])
      },
      error: err =>{
        if(err.error.length){
          err.error.forEach((error:string) =>{
            this.notifierService.ShowError(error);
          });
        }else{
          if(err.error.message === 'User already exists')
            this.notifierService.ShowError('Email já em uso');
          else
            this.notifierService.ShowError(err.error.message)
        }
        this.isSubmitted = false;
      }
    });
  }

  setName(event:string){
    this.user.name = event;
  }
  setEmail(event:string){
    this.user.email = event;
  }
  setPassword(event:string){
    this.user.password = event;
  }
  setConfirmPassword(event:string){
    this.confirmPassword = event
    if(!this.confirmPassword) return;
    if(this.user.password !== this.confirmPassword){
      this.incorrectPassword = true
    }else{
      this.incorrectPassword = false;
    }
  }

  validateForm(){
    let isMissingField = false;
    
    if(!this.user.name){
      this.notifierService.ShowError('Nome é obrigatório');
      isMissingField = true;
    }
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
    if(this.incorrectPassword){
      this.notifierService.ShowError('As senhas não batem');
      isMissingField = true;
    }
    return isMissingField;
  }

  isEmailValid(){
    return  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.user.email);
  }
}
