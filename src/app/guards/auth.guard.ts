import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/utils/token.service';

export const authGuard: CanActivateFn = (route, state) => {

    if (TokenService.isAuthenticated())
        return true;

    inject(Router).navigateByUrl('/auth/login');
    return false;

};