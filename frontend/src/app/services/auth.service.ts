import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '../interfaces/IUser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isUserAuthenticated: boolean = false;

  showSideBarEmitter = new EventEmitter<boolean>();

  constructor(private router: Router, private http: HttpClient) { }

  //implementar logica
  authenticate(user: IUser){
    if(user.email === 'teste@teste.com'){
      this.showSideBarEmitter.emit(true);

      this.isUserAuthenticated = true;
      this.router.navigate(['/home']);
    }else{
      this.showSideBarEmitter.emit(true);
      this.isUserAuthenticated = false;
    }
  }

  test(user:IUser): Observable<IUser>{
    console.log("Executing with... " + JSON.stringify(user));
    return this.http.post<IUser>(`${environment.API}signin`, user);
  }

  
}
