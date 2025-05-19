import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Doctor, Specialty } from '../interfaces/schedule.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  baseURL: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSpecialties(): Observable<HttpResponse<Specialty[]>> {
    return this.http
      .get<Specialty[]>(`${this.baseURL}/appointments/specialties`, {
        observe: 'response',
      })
      .pipe();
  }

  getAppointments() {
    return this.http.get('/api/appointments');
  }

  getDoctors(specialtyId: number): Observable<HttpResponse<Doctor[]>> {
    return this.http.get<Doctor[]>(
      `${this.baseURL}/appointments/doctors?specialty=${specialtyId}`,
      { observe: 'response' },
    );
  }
}
