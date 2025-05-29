import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {
  Doctor,
  Specialty,
  UserAppointment,
} from '../interfaces/schedule.interface';
import {map, Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  baseURL: string = environment.apiUrl;
  appointmentChangesSubject = new Subject<void>();
  appointmentChanges$ = this.appointmentChangesSubject.asObservable();

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

  schedule(
    doctorId: number,
    specialtyId: number,
    date: string,
  ): Observable<HttpResponse<any>> {
    return this.http.post(
      `${this.baseURL}/appointments/schedule`,
      {},
      {
        observe: 'response',
        params: {
          specialty: specialtyId,
          doctor: doctorId,
          date: date,
        },
      },
    );
  }

  getUserAppointments(): Observable<HttpResponse<UserAppointment[]>> {
    return this.http.get<UserAppointment[]>(`${this.baseURL}/appointments`, {
      observe: 'response',
    });
  }

  reloadAppointments() {
    this.appointmentChangesSubject.next();
  }
}
