import { Component } from '@angular/core';
import { Specialty } from '../../../../interfaces/schedule.interface';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { NgForOf } from '@angular/common';
import { StepperService } from '../../../../services/stepper.service';

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
  ],
  templateUrl: './specialty-select.component.html',
  standalone: true,
  styles: ``,
})
export class SpecialtySelectComponent {
  specialties: Specialty[] = [
    {
      id: 1,
      name: 'Cardiology',
      description: 'Study and treatment of heart disorders.',
    },
    {
      id: 2,
      name: 'Dermatology',
      description: 'Study and treatment of skin disorders.',
    },
    {
      id: 3,
      name: 'Neurology',
      description: 'Study and treatment of nervous system disorders.',
    },
    {
      id: 4,
      name: 'Pediatrics',
      description: "Study and treatment of children's health issues.",
    },
    {
      id: 5,
      name: 'Psychiatry',
      description: 'Study and treatment of mental health disorders.',
    },
  ];

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

  selectSpecialty(specialty: Specialty) {
    console.log('Selected specialty:', specialty);
    this.stepperService.setSpecialty(specialty);
    this.stepperService.nextStep();
  }

  get selectedSpecialty() {
    return this.selectedSpecialtyControl.value;
  }
}
