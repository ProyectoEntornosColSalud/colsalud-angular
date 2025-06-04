import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../feat/pages/home-page/home-page.component').then(
        (m) => m.HomePageComponent,
      ),
  },
  {
    path: 'doctor',
    loadComponent: () =>
      import('../../feat/pages/doctor-view/doctor-view.component').then(
        (m) => m.DoctorViewComponent,
      ),
  },
];
