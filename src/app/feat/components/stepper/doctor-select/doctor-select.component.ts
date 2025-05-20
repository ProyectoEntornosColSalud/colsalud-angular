import {
  ChangeDetectorRef,
  Component,
  LOCALE_ID,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { StepperService } from '../../../../services/stepper.service';
import { Doctor, Specialty } from '../../../../interfaces/schedule.interface';
import { AppointmentService } from '../../../../services/appointment.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  AsyncPipe,
  DatePipe,
  JsonPipe, LowerCasePipe,
  NgForOf,
  NgIf,
  registerLocaleData,
} from '@angular/common';
import esCO from '@angular/common/locales/es-CO';
import {
  combineLatest,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';

registerLocaleData(esCO);

@Component({
  selector: 'app-doctor-select',
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    NgForOf,
    AsyncPipe,
    NgIf,
    MatChipsModule,
    DatePipe,
    JsonPipe,
    LowerCasePipe,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es-CO' }],
  templateUrl: './doctor-select.component.html',
  standalone: true,
  styles: ``,
})
export class DoctorSelectComponent implements OnInit, OnDestroy {
  specialty: Specialty | null = null;
  doctors$: Observable<Doctor[] | null> = of([]);
  selectedDoctor: Doctor | null = null;
  groupedDates$: Observable<{ date: string; times: string[] }[]> = of([]);
  private destroy$ = new Subject<void>();

  constructor(
    private stepperService: StepperService,
    private appointmentService: AppointmentService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    combineLatest([
      this.stepperService.specialty$,
      this.stepperService.activeStep$,
    ])
      .pipe(
        takeUntil(this.destroy$),
        switchMap(([specialty, step]) => {
          this.specialty = specialty;

          if (step !== 1 || !specialty) return of([]);

          const cached = this.stepperService.getDoctorCache();
          if (cached) {
            return of(cached); // Usar cache si existe
          }

          return this.appointmentService.getDoctors(specialty.id).pipe(
            map((res) => {
              const doctors = res.body || [];
              this.stepperService.setDoctorCache(doctors); // Guardar en cache
              return doctors;
            }),
          );
        }),
      )
      .subscribe((doctors) => {
        this.doctors$ = of(doctors);

        const selected = this.stepperService.getSelectedDoctor();
        if (selected) {
          const match = doctors.find((d) => d.id === selected.id);
          if (match) {
            this.selectedDoctor = match;
            this.onDoctorChange(match); // Recargar fechas (desde cache si aplica)
          }
        }
        this.cdr.markForCheck();
      });
    this.stepperService.doctor$
      .pipe(takeUntil(this.destroy$))
      .subscribe((doctor) => {
        if (!doctor) {
          this.selectedDoctor = null; // ✅ Limpiar select
          this.groupedDates$ = of([]); // ✅ Limpiar fechas visibles
        }
      });
  }

  onDoctorChange(doctor: Doctor) {
    this.selectedDoctor = doctor;
    this.stepperService.setDoctor(doctor);

    const cachedDates = this.stepperService.getDatesForDoctor(doctor.id);
    if (cachedDates) {
      this.groupedDates$ = of(this.groupDates(cachedDates));
      return;
    }

    this.groupedDates$ = this.appointmentService
      .getAvailableDates(doctor.id)
      .pipe(
        map((dates: string[]) => {
          this.stepperService.setDatesForDoctor(doctor.id, dates); // Cachear fechas
          return this.groupDates(dates);
        }),
      );
  }

  private groupDates(dates: string[]): { date: string; times: string[] }[] {
    const groups: { [date: string]: string[] } = {};
    for (const dateTime of dates) {
      const date = dateTime.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(dateTime);
    }

    return Object.entries(groups).map(([date, times]) => ({ date, times }));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
