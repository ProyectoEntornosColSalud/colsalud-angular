import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {
  AppointmentDetail,
  Doctor,
  Specialty,
  UserAppointment,
} from '../interfaces/schedule.interface';
import { map, Observable, Subject } from 'rxjs';
import { withOptionalParams } from '../util/tools';

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

  getAvailableDatesFilter(
    doctorId: number,
    day: string,
    start?: number,
    end?: number,
  ): Observable<string[]> {
    const url = withOptionalParams(`${this.baseURL}/appointments/dates`, {
      doctor: doctorId,
      day,
      start,
      end,
    });
    return this.http.get<any>(url).pipe(map((res) => res?.available ?? []));
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

  cancelAppointment(appointmentId: number): Observable<HttpResponse<void>> {
    return this.http.put<void>(
      `${this.baseURL}/appointments/cancel?appointment=${appointmentId}`,
      {},
      {
        observe: 'response',
      },
    );
  }

  getDoctorAppointments(
    searchType: 'TODAY' | 'PENDING' | 'PAST',
    page: number,
    size: number,
  ): Observable<HttpResponse<any>> {
    return this.http.get<any>(
      withOptionalParams(`${this.baseURL}/doctor/appointments`, {
        status: searchType,
        page,
        size,
        sort: 'startTime,asc',
      }),
      {
        observe: 'response',
      },
    );
  }

  getAppointmentDetail(
    appointmentId: number,
  ): Observable<HttpResponse<AppointmentDetail>> {
    return this.http.get<AppointmentDetail>(
      `${this.baseURL}/appointments/${appointmentId}/detail`,
      {
        observe: 'response',
      },
    );
  }

  markAsAttended(appointmentId: number): Observable<HttpResponse<void>> {
    return this.http.patch<void>(
      `${this.baseURL}/doctor/appointments/${appointmentId}/check`,
      {},
      {
        observe: 'response',
      },
    );
  }

}
