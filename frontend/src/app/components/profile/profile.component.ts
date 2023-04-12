import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/IUser';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  loggedUser = {} as IUser;

  constructor(private userService:UserService, public ref:ChangeDetectorRef, private router: Router){
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
    this.userService.updateUser(this.loggedUser).subscribe(response =>{
      this.getLoggedUser();
      this.ref.detectChanges();
    })
  }

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
