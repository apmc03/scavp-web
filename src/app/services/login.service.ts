import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private httpClient = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  login(data: any) {
    return this.httpClient.post<any>(this.baseUrl + '/login', data);
  }

}