import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { toSnake } from '../util/tools';
import { LoginData, RegisterData } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseURl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(loginData: LoginData): Observable<HttpResponse<any>> {
    return this.http
      .post(`${this.baseURl}/auth/login`, loginData, { observe: 'response' })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        }),
      );
  }

  register(registerData: RegisterData): Observable<HttpResponse<any>> {
    return this.http
      .post(`${this.baseURl}/auth/register`, toSnake(registerData), {
        observe: 'response',
      })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        }),
      );
  }
}
