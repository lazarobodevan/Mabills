import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/IUser';
import { AuthService } from 'src/app/services/auth.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  loggedUser = {} as IUser;

  constructor(private userService:UserService, 
              private ref:ChangeDetectorRef, 
              private authService: AuthService,
              private notifierService: NotifierService){
    this.getLoggedUser();
  }

  getLoggedUser(){
    this.userService.getLoggedUser().subscribe(response=>{
      this.loggedUser = response;
      this.ref.detectChanges();
    });
  }

  setName(event:string){
    this.loggedUser.name = event;
  }

  setEmail(event:string){
    this.loggedUser.email = event;
  }

  setPassword(event:string){
    this.loggedUser.password = event;
  }

  updateUser(){
    this.userService.updateUser(this.loggedUser).subscribe({
      next: response =>{
        this.getLoggedUser();
        this.ref.detectChanges();
        this.notifierService.ShowSuccess("Usuário atualizado com sucesso")
      },
      error: err =>{
        if(err.error.length){
          err.error.forEach((error:string) =>{
            this.notifierService.ShowError(error);  
          });
        }else{
          this.notifierService.ShowError(err.error.message);  
        }
        this.ref.detectChanges();
      }
    })
  }

  logout(){
    this.authService.logout();
    this.notifierService.ShowSuccess("Logout com sucesso")
  }
}
