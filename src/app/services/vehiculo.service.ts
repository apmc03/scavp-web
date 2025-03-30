import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private httpClient = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  saveVehiculo(vehiculo: any) {
    return this.httpClient.post<any>(this.baseUrl + '/vehiculos', vehiculo);
  }

  updateVehiculo(vehiculo: any) {
    return this.httpClient.put<any>(this.baseUrl + '/vehiculos/' + vehiculo.vehiculo_id, vehiculo);
  }

  getVehiculos() {
    return this.httpClient.get<any>(this.baseUrl + '/vehiculos');
  }

  deleteVehiculo(id: number) {
    return this.httpClient.delete<any>(this.baseUrl + '/vehiculos/' + id);
  }

}