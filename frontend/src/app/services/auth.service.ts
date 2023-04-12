import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '../interfaces/IUser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private _isUserAuthenticated$ = new BehaviorSubject<boolean>(false);
  public isUserAuthenticated$ = this._isUserAuthenticated$.asObservable();

  showSideBarEmitter = new EventEmitter<boolean>();

  constructor(private router: Router, private http: HttpClient) { 
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
      })
    );
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/']).then(()=>{
      window.location.reload();
      this._isUserAuthenticated$ = new BehaviorSubject<boolean>(false);
      const token = localStorage.getItem('token');
      this._isUserAuthenticated$.next(!!token);
      this.showSideBarEmitter.emit(false);
      
    });
    
  }

  
}
