import {Routes} from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feat/pages/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./feat/pages/register/register.component')
      .then(m => m.RegisterComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./layout/user-home-layout/user-home-layout.component')
      .then(m => m.UserHomeLayoutComponent),
    loadChildren:
      () => import('./layout/user-home-layout/user-home.routes')
        .then(m => m.routes)
  }
];
