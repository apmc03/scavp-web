import { Routes } from '@angular/router';
import { FuncionariosComponent } from './funcionarios/funcionarios.component';
import { AccesosComponent } from './accesos/accesos.component';
import { VehiculosComponent } from './vehiculos/vehiculos.component';

export default [
    { path: 'funcionarios', component: FuncionariosComponent },
    { path: 'vehiculos', component: VehiculosComponent },
    { path: 'accesos', component: AccesosComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
