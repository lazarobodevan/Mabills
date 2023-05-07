import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '../interfaces/IUser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, delay, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { NotifierService } from './notifier.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private _isUserAuthenticated$ = new BehaviorSubject<boolean>(false);
  public isUserAuthenticated$ = this._isUserAuthenticated$.asObservable();

  showSideBarEmitter = new EventEmitter<boolean>();

  constructor(private router: Router, private http: HttpClient, private notifierService: NotifierService) { 
    const token = localStorage.getItem('token');
    this._isUserAuthenticated$.next(!!token);
  }

  authenticate(user:IUser): Observable<IUser>{
    return this.http.post<IUser>(`${environment.API}signin`, user).pipe(
      tap(response => {
        localStorage.setItem('token',response.token!);
        this._isUserAuthenticated$.next(true);
        this.router.navigate(['/home']);
        this.showSideBarEmitter.emit(true);
        this.notifierService.ShowSuccess("Login realizado")
      })
    );
  }

  logout(){
    localStorage.clear();
    this._isUserAuthenticated$ = new BehaviorSubject<boolean>(false);
    const token = localStorage.getItem('token');
    this._isUserAuthenticated$.next(!!token);
    this.showSideBarEmitter.emit(false);
    this.router.navigate(['/']).then(()=>{
      window.location.reload();      
    });
    
  }

  getAuthStatus(){
    return !!localStorage.getItem('token');
  }

  
}
