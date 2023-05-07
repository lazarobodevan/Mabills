import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay, startWith, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICategory } from '../interfaces/ICategory';
import { IWeekCards } from '../interfaces/IWeekCards';



@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly CACHE_KEY = 'httpCategoryCache'

  private headers = new HttpHeaders({
    'Content-type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  });
  
  constructor(private http: HttpClient) { }

  getCategories():Observable<ICategory[]>{
    let categories$ = this.http.get<ICategory[]>(`${environment.API}categories`,{headers:this.headers}).pipe(
      startWith(JSON.parse(localStorage[this.CACHE_KEY]||'[]')),
      tap({next: response =>{
        localStorage[this.CACHE_KEY] = JSON.stringify(response);
      }})
    );

    return categories$;
  }

  createCategory(category: ICategory):Observable<ICategory>{
    return this.http.post<ICategory>(`${environment.API}category`,category,{headers:this.headers});
  }

  deleteCategory(category: ICategory):Observable<any>{
    return this.http.delete<ICategory>(`${environment.API}category/${category._id}`, {headers:this.headers});
  }

  updateCategory(category:ICategory):Observable<ICategory>{
    return this.http.put<ICategory>(`${environment.API}category/${category._id}`, {
      name: category.name,
      color: category.color
    }, {headers: this.headers});
  }
}
