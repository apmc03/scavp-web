import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { FuncionarioService } from '../../services/funcionario.service';

@Component({
  selector: 'app-funcionarios',
  imports: [
    CommonModule,
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
    KeyFilterModule
     ],
  templateUrl: './funcionarios.component.html',
  styleUrl: './funcionarios.component.scss',
  providers: [MessageService]
})
export class FuncionariosComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  toastService = inject(MessageService);
  funcionarioService = inject(FuncionarioService);
  funcionarioForm: FormGroup;
  
  funcionarios: any[] = [];
  filters: string[] = ['nombres', 'apellidos', 'ci', 'correo', 'telefono', 'estado'];
  estados: any[] = [
    { label: 'Activo', value: 'ACTIVO' },
    { label: 'Inactivo', value: 'INACTIVO' }
  ];
  loading: boolean = true;
  displayModal: boolean = false;
  displayConfirmation: boolean = false;
  accionModal: string = 'Agregar';
  funcionarioId: number = 0;

  constructor() {
    this.funcionarioForm = this.formBuilder.group({
      funcionario_id: [''],
      nombres: ['', { validators: [ Validators.maxLength(50), Validators.minLength(4), Validators.required ]}],
      apellidos: ['', { validators: [ Validators.maxLength(50), Validators.minLength(4), Validators.required ]}],
      ci: ['', { validators: [ Validators.maxLength(10), Validators.minLength(10), Validators.required ]}],
      correo: ['', { validators: [Validators.email, Validators.required ]}],
      telefono: ['', { validators: [ Validators.maxLength(10), Validators.minLength(10), Validators.required ]}],
      estado: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getFuncionarios();
  }

  getFuncionarios() {
    this.funcionarioService.getFuncionarios().subscribe((data: any) => {
      this.funcionarios = data.result;
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

  editar(funcionario: any) {
    this.accionModal = 'Editar';
    this.funcionarioForm.setValue(funcionario);
    this.displayModal = true;
  }

  eliminar(funcionario: any) {
    this.accionModal = 'Editar';
    this.funcionarioForm.setValue(funcionario);
    this.funcionarioForm.controls['estado'].setValue("ELIMINADO");
    this.displayConfirmation = true;
  }

  closeModal() {
    this.funcionarioForm.reset();
    this.displayModal = false;
    this.displayConfirmation = false;
  }

  closeConfirmation() {
    this.displayConfirmation = false;
  }

  registrar() {
    this.funcionarioForm.markAllAsTouched();
    if (this.funcionarioForm.valid) {
      if(this.accionModal === 'Agregar') {
        this.guardarFuncionario(this.funcionarioForm.value);
      } else {
        this.actualizarFuncionario(this.funcionarioForm.value);
      }
    } else {
      this.toastService.add({ severity: 'error', summary: 'Mensaje de Error', detail: 'Existen errores en el formulario.' });
    }

  }

  guardarFuncionario(funcionario: any) {
    this.funcionarioService.saveFuncionario(funcionario).subscribe((data: any) => {
      if(data.code === "200") {
        this.getFuncionarios();
        this.closeModal();
        this.toastService.add({ severity: 'success', summary: 'Funcionario Agregado', detail: 'El funcionario ha sido agregado.' });
      } else {
        this.toastService.add({ severity: 'error', summary: 'Error al guardar', detail: 'El funcionario no ha sido guardado.' });    
      }
    });
  }

  actualizarFuncionario(funcionario: any) {
    this.funcionarioService.updateFuncionario(funcionario).subscribe((data: any) => {
      if(data.code === "200") {
        this.funcionarios = this.funcionarios.map(f => f.funcionario_id === funcionario.funcionario_id ? funcionario : f);
        this.closeModal();
        this.toastService.add({ severity: 'success', summary: 'Funcionario Actualizado', detail: 'El funcionario ha sido actualizado.' });
      } else {
        this.toastService.add({ severity: 'error', summary: 'Error al guardar', detail: 'El funcionario no ha sido guardado.' });    
      }
    });
  }

  eliminarFuncionario() {
    this.actualizarFuncionario(this.funcionarioForm.value);
  }
}