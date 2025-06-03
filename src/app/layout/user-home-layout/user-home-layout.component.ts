import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterOutlet } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { StepperService } from '../../services/stepper.service';

@Component({
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    RouterOutlet,
    NgOptimizedImage,
  ],
  templateUrl: './user-home-layout.component.html',
  standalone: true,
  styles: ``,
})
export class UserHomeLayoutComponent {
  constructor(
    private router: Router,
    private stepperService:StepperService
  ) {}

  navigate(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    sessionStorage.removeItem('token');
    this.stepperService.reset();
    this.router.navigate(['/']);
  }

  goToUpdateUserData() {
    this.router.navigate(['/info'])
  }
}
