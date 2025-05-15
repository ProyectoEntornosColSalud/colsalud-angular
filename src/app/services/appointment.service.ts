import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  constructor(private http: HttpClient) {}

  getAppointments() {
    return this.http.get('/api/appointments');
  }

  getDoctors(specialtyId: number) {
    return this.http.get(`/api/doctors/${specialtyId}`);
  }
}
