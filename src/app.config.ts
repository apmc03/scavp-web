import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, ErrorHandler, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { GlobalErrorHandler } from './app/handlers/global-error-handler';
import { MessageService } from 'primeng/api';
import { NgxSpinnerModule } from "ngx-spinner";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideAnimationsAsync(),
        providePrimeNG(
            { 
                theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } 
            }
        ),
        importProvidersFrom(
            NgxSpinnerModule.forRoot({ type: 'ball-fussion' })
        ),
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        MessageService
    ]
};
