import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class JwtService {
  
  jwtToken: string = '';
  decodedToken: { [key: string]: string } = {};

  constructor() { 
  }
  
  decodeToken() {
    this.jwtToken = localStorage.getItem('token')|| '';
    if (this.jwtToken) {
      this.decodedToken = jwt_decode(this.jwtToken);
    }
  }

  getExpiryTime() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken['exp'] : null;
  }

  isTokenExpired(): boolean {
    const expiryTime: string = this.getExpiryTime() || '';
    if (expiryTime) {
      return ((1000 * Number(expiryTime)) - (new Date()).getTime()) < 5000;
    } else {
      return false;
    }
  }
}
