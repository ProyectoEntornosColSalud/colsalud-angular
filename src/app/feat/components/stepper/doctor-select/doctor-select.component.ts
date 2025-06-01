import {
  ChangeDetectionStrategy,
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
  NgClass,
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
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import {
  MatTimepickerModule,
  MatTimepickerOption,
} from '@angular/material/timepicker';
import {getColTimeISO} from '../../../../util/tools';

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
    MatDatepickerModule,
    NgClass,
    MatTimepickerModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es-CO' }],
  templateUrl: './doctor-select.component.html',
  standalone: true,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorSelectComponent implements OnInit, OnDestroy {
  specialty: Specialty | null = null;
  doctors$: Observable<Doctor[] | null> = of([]);
  selectedDoctor: Doctor | null = null;
  groupedDates$: Observable<{ date: string; times: string[] }[]> = of([]);
  selectedTime: string | null = null;
  private destroy$ = new Subject<void>();
  noAppointments: boolean = false;
  starTimeOptions: { label: string; value: Date }[] = [];

  updateStartTimeOptions() {
    this.starTimeOptions = this.generateStartTimeSelectionOptions();
  }

  endTimeOptions: { label: string; value: Date }[] = [];
  selectedFilterStartDate: any;
  selectedFilterEndDate: any;
  selectedFilterDay: Date | null = null;

  updateEndTimeOptions() {
    this.endTimeOptions = this.generateStartTimeSelectionOptions();
  }

  constructor(
    private stepperService: StepperService,
    private appointmentService: AppointmentService,
    private cdr: ChangeDetectorRef,
  ) {}

  getStartTimeFilterOptions(): MatTimepickerOption<Date>[] {
    return this.generateTimeOptions();
  }

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
          this.selectedDoctor = null; //Limpiar select
          this.groupedDates$ = of([]); //Limpiar fechas visibles
        }
      });
  }

  onDoctorChange(doctor: Doctor) {
    this.selectedDoctor = doctor;
    this.stepperService.setDoctor(doctor);
    this.selectedFilterDay = null;
    this.selectedFilterStartDate = null;
    this.selectedFilterEndDate = null;
    const cachedDates = this.stepperService.getDatesForDoctor(doctor.id);
    if (cachedDates) {
      this.groupedDates$ = of(this.groupDates(cachedDates));
      return;
    }

    this.groupedDates$ = this.appointmentService
      .getAvailableDates(doctor.id)
      .pipe()
      .pipe(
        map((dates: string[]) => {
          this.noAppointments = dates.length === 0; // Actualizar estado de no citas
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

  onTimeSelected(value: any) {
    this.selectedTime = value;
    this.stepperService.setSelectedTime(value);
    this.stepperService.nextStep()
  }

  onDateChange(value: any) {
  }

  generateTimeOptions(): MatTimepickerOption<Date>[] {
    const opciones: MatTimepickerOption<Date>[] = [];
    const baseFecha = new Date(Date.UTC(2024, 0, 1)); // 2024-01-01T00:00:00Z

    for (let horaGMT5 = 7; horaGMT5 <= 18; horaGMT5++) {
      // Convertir a UTC sumando 5 horas
      const fechaUTC = new Date(baseFecha);
      fechaUTC.setUTCHours(horaGMT5 + 5, 0, 0, 0);

      opciones.push({
        label: this.formatoHHMM(horaGMT5), // Formato requerido por mat-timepicker
        value: fechaUTC,
      });
    }

    return opciones;
  }

  generateStartTimeSelectionOptions(): { label: string; value: Date }[] {
    const options: { label: string; value: Date }[] = [];
    const baseDate = new Date(Date.UTC(2024, 0, 1)); // 2024-01-01T00:00:00Z

    for (let hourGMT5 = 7; hourGMT5 <= 18; hourGMT5++) {
      // Convertir a UTC sumando 5 horas
      const utcDate = new Date(baseDate);
      utcDate.setUTCHours(hourGMT5 + 5, 0, 0, 0);

      options.push({
        label: this.formatoHHMM(hourGMT5), // Formato requerido por mat-timepicker
        value: utcDate,
      });
    }

    return options;
  }

  private formatoHHMM(hora24: number): string {
    // Devuelve por ejemplo "07:00", "18:00"
    return `${hora24.toString().padStart(2, '0')}:00`;
  }

  updateTimeOptions() {
    this.selectedFilterStartDate = null;
    this.selectedFilterEndDate = null;
    this.groupedDates$ = of([]); // Limpiar fechas visibles
    this.groupedDates$ = this.appointmentService
      .getAvailableDatesFilter(
        this.selectedDoctor!.id,
        this.selectedFilterDay?.toISOString().split('T')[0] ?? '',
        this.selectedFilterStartDate,
        this.selectedFilterEndDate,
      )
      .pipe(
        map((dates: string[]) => {
          this.stepperService.setDatesForDoctor(this.selectedDoctor!.id, dates); // Cachear fechas
          return this.groupDates(dates);
        }),
      );
    this.updateStartTimeOptions();
    this.updateEndTimeOptions();
  }

  onDateInput($event: MatDatepickerInputEvent<any, any>) {
  }

  today():string {
    return getColTimeISO().split('T')[0];
  }
}
