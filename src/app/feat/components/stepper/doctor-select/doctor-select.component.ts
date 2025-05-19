import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { StepperService } from '../../../../services/stepper.service';
import { Doctor, Specialty } from '../../../../interfaces/schedule.interface';
import { AppointmentService } from '../../../../services/appointment.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {
  combineLatest,
  concat,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';

@Component({
  selector: 'app-doctor-select',
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    NgForOf,
    AsyncPipe,
    NgIf,
  ],
  templateUrl: './doctor-select.component.html',
  standalone: true,
  styles: ``,
})
export class DoctorSelectComponent implements OnInit, OnDestroy {
  specialty: Specialty | null = null;
  doctors$: Observable<Doctor[] | null> = of([]);
  private destroy$ = new Subject<void>();

  constructor(
    private stepperService: StepperService,
    private appointmentService: AppointmentService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    // Mantener referencia a la especialidad actual
    this.specialty = null;

    this.doctors$ = combineLatest([
      this.stepperService.specialty$,
      this.stepperService.activeStep$,
    ]).pipe(
      takeUntil(this.destroy$),
      switchMap(([specialty, step]) => {
        this.specialty = specialty;

        // Si estamos en el paso 0 o no hay especialidad, limpiamos los doctores
        if (step != 1 || !specialty) return of([]);

        // Cuando estamos en paso 1 y hay especialidad, hacemos la petición
        return concat(
          of(null),
          this.appointmentService
            .getDoctors(specialty.id)
            .pipe(map((res) => res.body || [])),
        );
      }),
    );
  }

  selectDoctor(doctor: any) {
    this.stepperService.setDoctor(doctor);
    this.stepperService.nextStep();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
