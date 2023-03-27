import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ICategory } from '../interfaces/ICategory';
import { IWeekCards } from '../interfaces/IWeekCards';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private headers = new HttpHeaders({
    'Content-type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  });
  
  constructor(private http: HttpClient) { }

  getCategories():Observable<ICategory[]>{
    return this.http.get<ICategory[]>(`${environment.API}categories`,{headers:this.headers});
  }
}
