import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  private httpClient = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  saveFuncionario(funcionario: any) {
    return this.httpClient.post<any>(this.baseUrl + '/funcionarios', funcionario);
  }

  updateFuncionario(funcionario: any) {
    return this.httpClient.put<any>(this.baseUrl + '/funcionarios/' + funcionario.funcionario_id, funcionario);
  }

  getFuncionarios() {
    return this.httpClient.get<any>(this.baseUrl + '/funcionarios');
  }

  deleteFuncionario(id: number) {
    return this.httpClient.delete<any>(this.baseUrl + '/funcionarios/' + id);
  }

}