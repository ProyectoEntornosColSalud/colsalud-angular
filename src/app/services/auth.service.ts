import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { toCamel, toSnake } from '../util/tools';
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
}
