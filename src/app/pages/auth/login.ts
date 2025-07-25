import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { LoginService } from '../../services/login.service';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { TokenService } from '../../services/utils/token.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ButtonModule, 
        CheckboxModule, 
        InputTextModule, 
        PasswordModule, 
        FormsModule, 
        ReactiveFormsModule,
        RouterModule, 
        RippleModule, 
        AppFloatingConfigurator
    ],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <img src="/images/logo-gad.png" alt="Logo" class="mb-8 w-20 shrink-0 mx-auto" />

                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Bienvenido a SCAVP!</div>
                            <span class="text-muted-color font-medium">Inicio de sesión</span>
                        </div>

                        <div>
                            <form [formGroup]="authForm">
                                <label for="correo" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Correo electrónico</label>
                                <input pInputText id="correo" name="correo" formControlName="correo" type="text" placeholder="Correo electrónico" class="w-full md:w-[30rem] mb-8" />

                                <label for="password" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Contraseña</label>
                                <p-password id="password" name="password" formControlName="password" placeholder="Contraseña" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                                <div class="mt-8 mb-8">
                                    <p-button label="Iniciar sesión" styleClass="w-full" (click)="onSubmit()"></p-button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login implements OnInit, OnDestroy {
    authForm: FormGroup;
    private fb = inject(FormBuilder);
    private router = inject(Router); 
    private loginService = inject(LoginService);
    private toastService = inject(MessageService);
    private destroy$ = new Subject<void>();
  
    constructor() {
      this.authForm = this.fb.group({
        correo: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      });
    }
  
    ngOnInit(): void {
        TokenService.isAuthenticated() ? this.router.navigate(['/']) : null;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onSubmit() {
        this.authForm.markAllAsTouched();
    
        if(this.authForm.valid) {
          this.loginService.login(this.authForm.value).pipe(takeUntil(this.destroy$)).subscribe((res) => {
            if (res.token) {
              TokenService.setUser(res.result);
              TokenService.setToken(res.token);
    
              this.router.navigate(['/']);
            }
          });
        } else {          
          this.toastService.add({
            severity: 'error',
            summary: 'Mensaje de error',
            detail: 'Formulario no válido.'
          });
        }
    
    }

}
