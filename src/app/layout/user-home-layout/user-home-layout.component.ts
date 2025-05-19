import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterOutlet } from '@angular/router';
import {NgOptimizedImage} from '@angular/common';

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
  constructor(private router: Router) {}

  navigate(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
