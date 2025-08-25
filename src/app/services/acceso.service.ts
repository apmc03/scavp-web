import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {
  private httpClient = inject(HttpClient);
  private baseUrl = environment.apiUrl + '/accesos';

  getAccesos() {
    return this.httpClient.get<any>(this.baseUrl);
  }

  actualizarVisitante(data: any) {
    return this.httpClient.post<any>(this.baseUrl + '/actualizar-visitante', data);
  }
  
}