import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  static setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  static setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }
  
  static getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  static getUser(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
  
  static revokeToken(): void {
    localStorage.clear();
  }

  static isAuthenticated(): boolean {
    return this.getToken() ? true : false;
  }

}