import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  GuardResult,
  MaybeAsync,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  canActivate(): boolean | UrlTree {
    // Check if the user is authenticated
    const isAuthenticated = this.auth.isAuthenticated();
    if (!isAuthenticated) {
      // If not authenticated, show a message and redirect to the login page
      this.snackBar.open('Por favor, inicia sesión para continuar.', 'Cerrar', {
        verticalPosition: 'top',
        horizontalPosition: 'center',
        duration: 3000,
      });
    }
    return isAuthenticated ? true : this.router.parseUrl('/');
  }

  canActivateChild(): MaybeAsync<GuardResult> {
    return this.canActivate();
  }
}
