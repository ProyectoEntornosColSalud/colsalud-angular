import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { NgIf } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './login.component.html',
  standalone: true,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  formGroup: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {
    this.formGroup = this.fb.group({
      username: ['901234567', Validators.required],
      password: ['hola123', Validators.required],
    });
  }

  hide = signal(true);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  public navigate(path: string): void {
    this.router.navigate([path]).then();
  }

  public hasError(controlName: string): boolean {
    return (
      this.formGroup.get(controlName)!.invalid &&
      this.formGroup.get(controlName)!.touched
    );
  }

  login() {
    if (this.formGroup.valid) {
      this.authService
        .login({
          username: this.formGroup.value.username,
          password: this.formGroup.value.password,
        })
        .subscribe({
          next: (res) => {
            const token = res.headers.get('Authorization');
            if (token) localStorage.setItem('token', token);
            else throw new Error('No se ha recibido el token');
            this.navigate('/home');
          },
          error: (error) => {
            if (error.status == 401) {
              this.snackBar.open('Usuario o contraseña incorrectos', '', {
                duration: 5000,
                panelClass: ['error-snackbar', 'mb-5'],
                horizontalPosition: 'right',
                verticalPosition: 'top',
              });
            }
          },
        });
    }
  }
}
