import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Notfound } from './app/pages/notfound/notfound';
import { InicioComponent } from './app/pages/inicio/inicio.component';
import { authGuard } from './app/guards/auth.guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: InicioComponent },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ],
        canActivate: [authGuard]
    },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
