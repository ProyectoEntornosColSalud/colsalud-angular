import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { toCamel, toSnake } from '../util/tools';
import { LoginData, RegisterData } from '../interfaces/auth.interface';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseURl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackbar: MatSnackBar,
  ) {}

  login(loginData: LoginData) {
    this.http
      .post(`${this.baseURl}/auth/login`, loginData, { observe: 'response' })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        }),
      )
      .subscribe({
        next: (res) => {
          const token = res.headers.get('Authorization');
          if (token) sessionStorage.setItem('token', token);
          else throw new Error('No se ha recibido el token');
          const decodedToken = JSON.parse(
            atob(token.split('.')[1]),
          ) as { isDoctor: boolean};
          console.log('Decoded Token:', decodedToken);
          this.navigate(decodedToken.isDoctor ? '/home/doctor' : '/home');
        },
        error: (error) => {
          if (error.status == 401) {
            this.snackbar.open('Usuario o contraseña incorrectos', 'Ok', {
              duration: 5000,
              panelClass: ['error-snackbar', 'mb-5'],
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          }
        },
      });
  }

  public navigate(path: string): void {
    this.router.navigate([path]).then();
  }

  register(registerData: RegisterData) {
    this.http
      .post(`${this.baseURl}/auth/register`, toSnake(registerData), {
        observe: 'response',
      })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        }),
      )
      .subscribe({
        next: (res) => {
          const token = res.headers.get('Authorization');
          if (token) sessionStorage.setItem('token', token);
          else throw new Error('No se ha recibido el token');
          this.router.navigate(['home']).then();
        },
        error: (error) => {
          console.error('Register error', error);
          this.snackbar.open(error.error.message, 'Ok', {
            duration: 5000,
            panelClass: ['error-snackbar', 'mb-5'],
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        },
      });
  }

  getUserInfo(): Observable<HttpResponse<RegisterData>> {
    return this.http
      .get<RegisterData>(`${this.baseURl}/user`, {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          const transformedBody = toCamel(response.body);
          // Clone the response with transformed body
          return response.clone({ body: transformedBody });
        }),
      );
  }

  updateUserInfo(data: RegisterData) {
    // Transform data to snake_case before sending
    data = toSnake(data);
    return this.http.put(
      `${this.baseURl}/user`,
      { ...data },
      { observe: 'response' },
    );
  }

  isAuthenticated() {
    return !!sessionStorage.getItem('token');
  }
}
