import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AccesoService } from '../../services/acceso.service';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-accesos',
  imports: [
    CommonModule,
    TableModule, 
    TagModule, 
    InputTextModule,
    ButtonModule,
    InputIconModule, 
    IconFieldModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule

  ],
  templateUrl: './accesos.component.html',
  styleUrl: './accesos.component.scss'
})
export class AccesosComponent implements OnInit, OnDestroy {
  accesosService = inject(AccesoService);
  private fb = inject(FormBuilder);
  private toastService = inject(MessageService);
  private spinner = inject(NgxSpinnerService);
  private destroy$ = new Subject<void>();
  loading: boolean = true;
  filters: string[] = ['placa', 'visitante', 'fecha_ingreso', 'fecha_salida'];
  accesos: any[] = [];
  accesoSeleccionado: any = null;
  displayDialog: boolean = false;
  visitanteForm: FormGroup;

  constructor() { 
    this.visitanteForm = this.fb.group({
      acceso_id: ['', Validators.required],
      persona: ['', [Validators.required, Validators.minLength(6)]],
    });
    
  }

  ngOnInit(): void {
    this.getAccesos();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAccesos() {
    this.loading = true;
    this.spinner.show();
    this.accesosService.getAccesos()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        this.accesos = response.result;
        this.loading = false;
        this.spinner.hide();
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
        this.spinner.hide();
      }
    });  
  }

  getSeverity(status: number | null) {
    if(status != null)
      return 'success';
    else
      return 'info';
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  showDialog(acceso: any) {
    this.displayDialog = true;
    this.accesoSeleccionado = acceso;
  }

  closeDialog() {
    this.displayDialog = false;
    this.accesoSeleccionado = null;
    this.visitanteForm.reset();
  }

  actualizarAcceso() {
    this.visitanteForm.markAllAsTouched();

    this.visitanteForm.get('acceso_id')?.setValue(this.accesoSeleccionado.acceso_id);
    if (this.visitanteForm.valid) {
      this.spinner.show();
      this.accesosService.actualizarVisitante(this.visitanteForm.value)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          this.spinner.hide();
          this.toastService.add({ severity: 'success', summary: 'Successful', detail: 'Acceso actualizado' });
          this.closeDialog();
          this.getAccesos();
        },
        error: (error) => {
          this.spinner.hide();
          this.toastService.add({ severity: 'error', summary: 'Error', detail: 'Acceso no actualizado' });
        }
      });
    } else {
      this.toastService.add({ severity: 'error', summary: 'Error', detail: 'Por favor, ingrese todos los datos' });
    }
  }

}
