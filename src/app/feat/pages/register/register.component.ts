import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { toLocalDate } from '../../../util/tools';
import {GENDERS} from '../../../interfaces/schedule.interface';

@Component({
  imports: [
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  styles: [],
})
export class RegisterComponent {
  documents: SelectOption[] = [
    { value: 'CC', viewValue: 'Cédula de ciudadanía' },
    { value: 'TI', viewValue: 'Tarjeta de identidad' },
    { value: 'CE', viewValue: 'Cédula de extranjería' },
  ];
  readonly genders = GENDERS;
  registerForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {
    this.registerForm = this.fb.group({
      docType: ['CC', Validators.required],
      docNumber: ['12344321', Validators.required],
      name: ['Jon', Validators.required],
      lastname: ['Snow', Validators.required],
      gender: ['M', Validators.required],
      dob: [new Date(), Validators.required],
      email: ['jonsnou@email.com', [Validators.required, Validators.email]],
      phone: ['3213213213', Validators.required],
      password: ['hola123', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['hola123', [Validators.required]],
    });
  }

  getMaxDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  getMinDate(): string {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 120);
    return today.toISOString().split('T')[0];
  }

  onlyAllowNumbers(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
      'Slash',
      '/',
    ];
    console.log(event.key);

    const isNumber = /^\d$/.test(event.key);
    const isAllowed = allowedKeys.includes(event.key) || isNumber;

    if (!isAllowed) {
      event.preventDefault();
    }
  }

  register() {
    const date: Date = this.registerForm.value.dob;
    const formatted = toLocalDate(date);
    this.authService
      .register({
        docType: this.registerForm.value.docType,
        docNumber: this.registerForm.value.docNumber,
        name: this.registerForm.value.name,
        lastName: this.registerForm.value.lastname,
        gender: this.registerForm.value.gender,
        birthDate: formatted,
        email: this.registerForm.value.email,
        phone: this.registerForm.value.phone,
        password: this.registerForm.value.password,
      })
  }

  goToLogin() {
    this.router.navigate(['/']).then();
  }
}

interface SelectOption {
  value: string;
  viewValue: string;
}
