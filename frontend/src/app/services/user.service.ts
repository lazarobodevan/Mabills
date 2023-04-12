import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../interfaces/IUser';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private headers = new HttpHeaders({
    'Content-type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  });

  constructor(private http: HttpClient) { }

  getLoggedUser():Observable<IUser>{
    return this.http.get<IUser>(`${environment.API}user`, {headers: this.headers});
  }

  updateUser(user:IUser):Observable<IUser>{
    return this.http.put<IUser>(`${environment.API}users`,{
      name: user.name,
      password: user.password,
      email: user.email
    },{headers: this.headers});
  }

  createUser(user:IUser):Observable<IUser>{
    return this.http.post<IUser>(`${environment.API}signup`,{
      name: user.name,
      email: user.email,
      password: user.password
    })
  }
}
