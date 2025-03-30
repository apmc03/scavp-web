import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { KeyFilterModule } from 'primeng/keyfilter';
import { VehiculoService } from '../../services/vehiculo.service';
import { FuncionarioService } from '../../services/funcionario.service';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-vehiculos',
  imports: [
      CommonModule,
      FormsModule,
      TableModule, 
      TagModule, 
      InputTextModule,
      ButtonModule,
      InputIconModule, 
      IconFieldModule,
      DialogModule,
      SelectButtonModule,
      ToastModule,
      ReactiveFormsModule,
      KeyFilterModule,
      AutoCompleteModule],
  templateUrl: './vehiculos.component.html',
  styleUrl: './vehiculos.component.scss',
  providers: [MessageService]
})
export class VehiculosComponent  implements OnInit {
  formBuilder = inject(FormBuilder);
  toastService = inject(MessageService);
  vehiculoService = inject(VehiculoService);
  funcionarioService = inject(FuncionarioService);
  vehiculoForm: FormGroup;

  funcionarios: any[] = [];
  vehiculos: any[] = [];
  autoFilteredValue: any[] = [];
  filters: string[] = ['placa', 'tipo', 'funcionario.nombres', 'funcionario.apellidos', 'estado'];
  estados: any[] = [
    { label: 'Activo', value: 'ACTIVO' },
    { label: 'Inactivo', value: 'INACTIVO' }
  ];
  loading: boolean = true;
  displayModal: boolean = false;
  displayConfirmation: boolean = false;
  accionModal: string = 'Agregar';
  vehiculoId: number = 0;

  constructor() {
    this.vehiculoForm = this.formBuilder.group({
      vehiculo_id: [''],
      placa: ['', { validators: [ Validators.maxLength(7), Validators.minLength(6), Validators.required ]}],
      tipo: ['', { validators: [ Validators.maxLength(50), Validators.minLength(4), Validators.required ]}],
      funcionario_id: ['', Validators.required],
      estado: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getVehiculos();
    this.getFuncionarios();
  }

  getVehiculos() {
    this.vehiculoService.getVehiculos().subscribe((data: any) => {
      this.vehiculos = data.result;
      this.loading = false;
    });
  }

  getFuncionarios() {
    this.funcionarioService.getFuncionarios().subscribe((data: any) => {      
      data.result.map((f: any) => {
        this.funcionarios.push(
          {
            'name': f.nombres + ' ' + f.apellidos,
            'code': f.funcionario_id
          });
      });
      this.loading = false;
    });
  }

  getSeverity(status: string) {
    switch (status) {
        case 'ACTIVO':
            return 'success';

        case 'INACTIVO':
            return 'warn';

        case 'ELIMINADO':
            return 'danger';

        default:
            return 'info';
    } 
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  
  agregar() {
    this.accionModal = 'Agregar';
    this.displayModal = true;
  }

  editar(vehiculo: any) {
    this.accionModal = 'Editar';
    this.mapData(vehiculo);
    this.displayModal = true;
  }

  mapData(data: any){
    this.vehiculoForm.controls['vehiculo_id'].setValue(data.vehiculo_id);
    this.vehiculoForm.controls['placa'].setValue(data.placa);
    this.vehiculoForm.controls['tipo'].setValue(data.tipo);
    this.vehiculoForm.controls['funcionario_id'].setValue(data.funcionario.funcionario_id);
    this.vehiculoForm.controls['estado'].setValue(data.estado);
  }

  eliminar(vehiculo: any) {
    this.accionModal = 'Editar';
    this.mapData(vehiculo);
    this.vehiculoForm.controls['estado'].setValue("ELIMINADO");
    this.displayConfirmation = true;
  }

  closeModal() {
    this.vehiculoForm.reset();
    this.displayModal = false;
    this.displayConfirmation = false;
  }

  closeConfirmation() {
    this.displayConfirmation = false;
  }

  registrar() {
    this.vehiculoForm.markAllAsTouched();
    if (this.vehiculoForm.valid) {
      if(this.accionModal === 'Agregar') {
        this.guardarVehiculo(this.vehiculoForm.value);
      } else {
        this.actualizarVehiculo(this.vehiculoForm.value);
      }
    } else {
      this.toastService.add({ severity: 'error', summary: 'Mensaje de Error', detail: 'Existen errores en el formulario.' });
    }

  }

  guardarVehiculo(vehiculo: any) {
    this.vehiculoService.saveVehiculo(vehiculo).subscribe((data: any) => {
      if(data.code === "200") {
        this.getVehiculos();
        this.closeModal();
        this.toastService.add({ severity: 'success', summary: 'Vehiculo Agregado', detail: 'El vehiculo ha sido agregado.' });
      } else {
        this.toastService.add({ severity: 'error', summary: 'Error al guardar', detail: 'El vehiculo no ha sido guardado.' });    
      }
    });
  }

  actualizarVehiculo(vehiculo: any) {
    this.vehiculoService.updateVehiculo(vehiculo).subscribe((data: any) => {
      if(data.code === "200") {
        this.getVehiculos();
        this.closeModal();
        this.toastService.add({ severity: 'success', summary: 'Vehiculo Actualizado', detail: 'El vehiculo ha sido actualizado.' });
      } else {
        this.toastService.add({ severity: 'error', summary: 'Error al guardar', detail: 'El vehiculo no ha sido guardado.' });    
      }
    });
  }

  eliminarVehiculo() {
    this.actualizarVehiculo(this.vehiculoForm.value);
  }
  
  filterFuncionario(event: AutoCompleteCompleteEvent) {
    const filtered: any[] = [];
    const query = event.query;

    for (let i = 0; i < (this.funcionarios as any[]).length; i++) {
        const funcionario = (this.funcionarios as any[])[i];
        if (funcionario.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(funcionario);
        }
    }

    this.autoFilteredValue = filtered;  
  }

  setFuncionario(event: any) {
    this.vehiculoForm.controls['funcionario_id'].setValue(event.value.code);
  }

}