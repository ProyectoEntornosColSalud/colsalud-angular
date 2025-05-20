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

  private selectedTimeSubject = new BehaviorSubject<string>("");
  selectedTime$ = this.selectedTimeSubject.asObservable();

  // Nuevo BehaviorSubject para índice de paso activo
  private activeStepSubject = new BehaviorSubject<number>(0);
  activeStep$ = this.activeStepSubject.asObservable();

  // caches en memoria
  private doctorCache: Doctor[] | null = null;
  private doctorDatesCache = new Map<number, string[]>();

  setSpecialty(specialty: Specialty) {
    const current = this.specialtySubject.value;

    if (!current || current.id !== specialty.id) {
      this.specialtySubject.next(specialty);
      this.doctorSubject.next(null);
      this.doctorCache = null;
      this.doctorDatesCache.clear();
    }
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

  getSelectedDoctor() {
    return this.doctorSubject.value;
  }

  // Accesores para cache
  setDoctorCache(doctors: Doctor[] | null) {
    this.doctorCache = doctors;
  }

  getDoctorCache(): Doctor[] | null {
    return this.doctorCache;
  }

  setDatesForDoctor(doctorId: number, dates: string[]) {
    this.doctorDatesCache.set(doctorId, dates);
  }

  getDatesForDoctor(doctorId: number): string[] | undefined {
    return this.doctorDatesCache.get(doctorId);
  }

  clearDatesCache() {
    this.doctorDatesCache.clear();
  }

  setSelectedTime(value: any) {
    this.selectedTimeSubject.next(value);
  }

  getSelectedTime() {
    return this.selectedTimeSubject.value;
  }
}
