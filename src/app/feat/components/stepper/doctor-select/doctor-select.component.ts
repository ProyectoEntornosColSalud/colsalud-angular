import { Component, OnInit } from '@angular/core';
import { StepperService } from '../../../../services/stepper.service';
import { Specialty } from '../../../../interfaces/schedule.interface';

@Component({
  selector: 'app-doctor-select',
  imports: [],
  templateUrl: './doctor-select.component.html',
  standalone: true,
  styles: ``,
})
export class DoctorSelectComponent implements OnInit {
  specialty: Specialty | null = null;

  constructor(private stepperService: StepperService) {}

  ngOnInit() {
    this.stepperService.specialty$.subscribe((s) => (this.specialty = s));
  }

  selectDoctor(doctor: any) {
    this.stepperService.setDoctor(doctor);
    this.stepperService.nextStep();
  }
}
