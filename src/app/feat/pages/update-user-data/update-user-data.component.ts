import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {toLocalDate} from '../../../util/tools';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';

@Component({
  imports: [    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,],
  templateUrl: './update-user-data.component.html',
  standalone: true,
  styles: ``,
})
export class UpdateUserDataComponent implements OnInit{
  documents: SelectOption[] = [
    { value: 'CC', viewValue: 'Cédula de ciudadanía' },
    { value: 'TI', viewValue: 'Tarjeta de identidad' },
    { value: 'CE', viewValue: 'Cédula de extranjería' },
  ];
  genders: SelectOption[] = [
    { value: 'hombre', viewValue: 'Hombre' },
    { value: 'mujer', viewValue: 'Mujer' },
    { value: 'no-binario', viewValue: 'No binario' },
    { value: 'genero-fluido', viewValue: 'Género fluido' },
    { value: 'bigenero', viewValue: 'Bigénero' },
    { value: 'trigenero', viewValue: 'Trigénero' },
    { value: 'agenero', viewValue: 'Agénero' },
    { value: 'demiboy', viewValue: 'Demiboy' },
    { value: 'demigirl', viewValue: 'Demigirl' },
    { value: 'neutrois', viewValue: 'Neutrois' },
    { value: 'maverique', viewValue: 'Maverique' },
    { value: 'androgino', viewValue: 'Andrógino' },
    { value: 'genero-queer', viewValue: 'Género queer' },
    { value: 'dos-espiritus', viewValue: 'Dos espíritus' },
    { value: 'hijra', viewValue: 'Hijra' },
    { value: 'faafafine', viewValue: 'Fa’afafine' },
    { value: 'bakla', viewValue: 'Bakla' },
    { value: 'muxhe', viewValue: 'Muxhe' },
    { value: 'intergenero', viewValue: 'Intergénero' },
    { value: 'autogenero', viewValue: 'Autogénero' },
    { value: 'aliagenero', viewValue: 'Aliagénero' },
    { value: 'xenogenero', viewValue: 'Xenogénero' },
  ];
  form: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      docType: ['', Validators.required],
      docNumber: [{value:'', disabled:true}, Validators.required],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', []],
      confirmPassword: ['', []],
    });
  }

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe(
      (res) => {
        const userData = res.body
        if (!userData){
          return;
        }
        this.form.patchValue({
          docType: userData.docType,
          docNumber: userData.docNumber,
          name: userData.name,
          lastname: userData.lastName,
          gender: userData.gender,
          dob: userData.birthDate,
          email: userData.email,
          phone: userData.phone,
        });
      }
    )
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

  updateUserInfo() {
    let date: string = this.form.value.dob;
    const YYYY_MM_DD_REGEX = /^\d{4}-\d{2}-\d{2}$/;
    if (!YYYY_MM_DD_REGEX.test(date)){
      date = toLocalDate(new Date(date));
    }
    this.authService
      .updateUserInfo({
        name: this.form.value.name,
        gender: this.form.value.gender,
        email: this.form.value.email,
        phone: this.form.value.phone,
        lastName: this.form.value.lastname,
        birthDate: date,
        docType: this.form.value.docType,
        docNumber: this.form.value.docNumber,
        password: this.form.value.password,
      })
      .subscribe({
        error: (error) => {
          console.error('Update info error', error);
          this.snackBar.open(error.error.message, '', {
            duration: 5000,
            panelClass: ['error-snackbar', 'mb-5'],
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        },
      });
  }

  goHome() {
    this.router.navigate(['/home']).then();
  }
}

interface SelectOption {
  value: string;
  viewValue: string;
}
