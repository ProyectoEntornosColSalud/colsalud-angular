import { Component, OnInit, ViewChild } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Specialty } from '../../../interfaces/schedule.interface';
import { SpecialtySelectComponent } from '../stepper/specialty-select/specialty-select.component';
import { StepperService } from '../../../services/stepper.service';
import { MatIconModule } from '@angular/material/icon';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ConfirmComponent } from '../stepper/confirm/confirm.component';
import { DoctorSelectComponent } from '../stepper/doctor-select/doctor-select.component';

@Component({
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    SpecialtySelectComponent,
    MatIconModule,
    ConfirmComponent,
    DoctorSelectComponent,
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
  templateUrl: './schedule.component.html',
  standalone: true,
  styles: ``,
  selector: 'app-schedule',
})
export class ScheduleComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  selectedSpecialtyControl: FormControl<Specialty | null> = new FormControl(
    null,
    Validators.required,
  );
  specialtyFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private stepperService: StepperService,
  ) {
    this.specialtyFormGroup = this.fb.group({
      selectedSpecialty: this.selectedSpecialtyControl,
    });
  }

  ngOnInit(): void {
    this.stepperService.nextStep$.subscribe(() => {
      this.stepper.next();
    });

    this.stepperService.resetStepper$.subscribe(() => {
      this.stepper.reset();
      this.stepperService.setActiveStep(0);
    });
  }

  onStepChange(selectedIndex: number) {
    this.stepperService.setActiveStep(selectedIndex);
  }
}
