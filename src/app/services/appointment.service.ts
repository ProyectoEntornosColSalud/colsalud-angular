import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Doctor, Specialty } from '../interfaces/schedule.interface';
import { map, Observable } from 'rxjs';

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

  getAvailableDates(doctorId: number): Observable<string[]> {
    return this.http
      .get<any>(`${this.baseURL}/appointments/dates`, {
        params: { doctor: doctorId },
      })
      .pipe(map((res) => res?.available ?? []));
  }

  getDoctors(specialtyId: number): Observable<HttpResponse<Doctor[]>> {
    return this.http.get<Doctor[]>(
      `${this.baseURL}/appointments/doctors?specialty=${specialtyId}`,
      { observe: 'response' },
    );
  }
}
