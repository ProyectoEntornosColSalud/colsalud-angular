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

  // Nuevo BehaviorSubject para índice de paso activo
  private activeStepSubject = new BehaviorSubject<number>(0);
  activeStep$ = this.activeStepSubject.asObservable();

  setSpecialty(specialty: Specialty) {
    this.specialtySubject.next(specialty);
    this.doctorSubject.next(null); // Resetear doctor si se cambia especialidad
  }

  setDoctor(doctor: Doctor | null) {
    this.doctorSubject.next(doctor);
  }

  nextStep() {
    this.nextStepSubject.next();
  }

  // Método para actualizar el step activo
  setActiveStep(index: number) {
    this.activeStepSubject.next(index);
  }

  get currentStep(): number {
    return this.activeStepSubject.value;
  }
}
