import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AccesoService } from '../../services/acceso.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accesos',
  imports: [
    CommonModule,
    TableModule, 
    TagModule, 
    InputTextModule,
    ButtonModule,
    InputIconModule, 
    IconFieldModule
  ],
  templateUrl: './accesos.component.html',
  styleUrl: './accesos.component.scss'
})
export class AccesosComponent implements OnInit {
  accesosService = inject(AccesoService);

  accesos: any[] = [];
  filters: string[] = ['placa', 'visitante', 'fecha_ingreso', 'fecha_salida'];
  loading: boolean = true;

  ngOnInit(): void {
    this.getAccesos();
  }

  getAccesos() {
    this.accesosService.getAccesos().subscribe((data: any) => {
      this.accesos = data.result;
      this.loading = false;
    });
  }

  getSeverity(status: string) {
    switch (status) {
        case 'VISITANTE':
            return 'info';

        case 'FUNCIONARIO':
            return 'success';

        default:
            return 'info';
    } 
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

}
