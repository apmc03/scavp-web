import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { FuncionariosComponent } from './funcionarios/funcionarios.component';
import { AccesosComponent } from './accesos/accesos.component';
import { VehiculosComponent } from './vehiculos/vehiculos.component';
import { InicioComponent } from './inicio/inicio.component';

export default [
    { path: 'funcionarios', component: FuncionariosComponent },
    { path: 'vehiculos', component: VehiculosComponent },
    { path: 'accesos', component: AccesosComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
