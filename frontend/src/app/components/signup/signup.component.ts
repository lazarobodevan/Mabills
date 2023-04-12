import { Component } from '@angular/core';
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
  incorrectPassword: boolean = false;

  constructor(private userService: UserService, private notifierService: NotifierService){}

  signUp(){
    if(this.incorrectPassword){
      throw("Senhas não batem");
    }
    this.userService.createUser(this.user).subscribe({
      next: response =>{
        console.log(response)
      },
      error: err =>{
        err.error.forEach((error:string) =>{
          this.notifierService.ShowError(error);
        })
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
      console.log("senha incorreta");
      this.incorrectPassword = true
    }else{
      this.incorrectPassword = false;
    }
  }
}
