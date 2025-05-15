import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Doctor, Specialty } from '../interfaces/schedule.interface';

@Injectable({
  providedIn: 'root',
})
export class StepperService {
  private nextStepSubject = new Subject<void>();
  nextStep$ = this.nextStepSubject.asObservable();

  private specialtySubject = new BehaviorSubject<Specialty | null>(null);
  specialty$ = this.specialtySubject.asObservable();

  private doctorSubject = new BehaviorSubject<Doctor | null>(null);
  doctor$ = this.doctorSubject.asObservable();

  setSpecialty(specialty: Specialty) {
    this.specialtySubject.next(specialty);
    this.doctorSubject.next(null); // Resetear doctor si se cambia especialidad
  }

  setDoctor(doctor: Doctor) {
    this.doctorSubject.next(doctor);
  }

  get currentSpecialty() {
    return this.specialtySubject.value;
  }

  get currentDoctor() {
    return this.doctorSubject.value;
  }

  nextStep() {
    this.nextStepSubject.next();
  }
}
