import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Principal',
                items: [{ label: 'Inicio', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Gestión',
                items: [
                    { label: 'Funcionarios', icon: 'pi pi-fw  pi-user', routerLink: ['/pages/funcionarios'] },
                    { label: 'Vehículos', icon: 'pi pi-fw  pi-car', routerLink: ['/pages/vehiculos'] },
                    { label: 'Accesos', icon: 'pi pi-fw  pi-id-card', routerLink: ['/pages/accesos'] }
                
                ]
            },
        ]
    }
}
