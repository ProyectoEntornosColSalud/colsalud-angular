import { Component, OnInit } from '@angular/core';
import { Specialty } from '../../../../interfaces/schedule.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { StepperService } from '../../../../services/stepper.service';
import { AppointmentService } from '../../../../services/appointment.service';
import { map, Observable, of } from 'rxjs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-specialty-select',
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
    NgIf,MatProgressSpinnerModule
  ],
  templateUrl: './specialty-select.component.html',
  standalone: true,
  styles: ``,
})
export class SpecialtySelectComponent implements OnInit {
  specialties$: Observable<Specialty[]> = of([]);

  constructor(
    private stepperService: StepperService,
    private appointmentService: AppointmentService,
  ) {}

  ngOnInit(): void {
    const currentStep = this.stepperService.currentStep;
    if (currentStep === 0) {
      this.specialties$ = this.appointmentService
        .getSpecialties()
        .pipe(map((res) => res.body || []));
    }
  }

  selectSpecialty(specialty: Specialty) {
    console.log('Selected specialty:', specialty);
    this.stepperService.setSpecialty(specialty);
    this.stepperService.nextStep();
  }
}
