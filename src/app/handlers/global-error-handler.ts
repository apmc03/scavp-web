import { ErrorHandler, inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    private toastService = inject(MessageService);

    handleError(error: any): void {
        console.error('Global Error Handler:');

        if (error instanceof HttpErrorResponse) {
            console.error('Backend returned status code:', error.status);
            console.error('Response body:', error.error);

            switch (error.status) {
                case 400:
                    if (error.error.message.includes('already exists')) {
                        this.toastService.add({
                            severity: 'error',
                            summary: 'Mensaje de error',
                            detail: 'Este registro ya existe.'
                        });
                    } else {
                        this.toastService.add({
                            severity: 'error',
                            summary: 'Mensaje de error',
                            detail: 'Se ha presentado un error en la solicitud.'
                        });
                    }
                    
                    break;

                case 401:
                    let message: string = 'Su sesión ha expirado.';

                    if(error.error) 
                        switch (error.error.message) {
                            case 'user not found':
                                message = 'Usuario no encontrado.';
                                break;
                            case 'Bad credentials':
                                message = 'Credenciales incorrectas.';
                                break;
                            default:
                                message = '';
                                break;
                        }
                    
                    this.toastService.add({
                        severity: 'error',
                        summary: 'Mensaje de error',
                        detail: message
                    });

                    break;

                case 403:
                    this.toastService.add({
                        severity: 'error',
                        summary: 'Mensaje de error',
                        detail: 'No tiene permisos para acceder al recurso.'
                    });
                    break;

                case 404:
                    this.toastService.add({
                        severity: 'error',
                        summary: 'Mensaje de error',
                        detail: 'No se ha encontrado el recurso.'
                    });
                    break;
                case 500:
                    if (error.error.message.includes('a foreign key constraint fails')) {
                        this.toastService.add({
                            severity: 'error',
                            summary: 'Mensaje de error',
                            detail: 'Este registro se encuentra en uso.'
                        });
                    } else {
                        this.toastService.add({
                            severity: 'error',
                            summary: 'Mensaje de error',
                            detail: 'Se ha producido un error en el servidor.'
                        });
                    }

                    break;
                default:
                    this.toastService.add({
                        severity: 'error',
                        summary: 'Mensaje de error',
                        detail: '¡Ha ocurrido un error inesperado!'
                    });

                    break;
            }

        } else {
            console.error('An unexpected error occurred:', error.message);
            this.toastService.add({
                severity: 'error',
                summary: 'Mensaje de error',
                detail: '¡Ha ocurrido un error inesperado!'
            });
        }

    }
}