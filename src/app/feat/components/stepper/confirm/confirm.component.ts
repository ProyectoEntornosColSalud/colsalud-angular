import { Component, OnInit } from '@angular/core';
import { StepperService } from '../../../../services/stepper.service';
import { Doctor, Specialty } from '../../../../interfaces/schedule.interface';

@Component({
  selector: 'app-confirm',
  imports: [],
  templateUrl: './confirm.component.html',
  standalone: true,
  styles: ``,
})
export class ConfirmComponent implements OnInit {
  specialty: Specialty | null = null;
  doctor: Doctor | null = null;

  constructor(private stepperService: StepperService) {}

  ngOnInit() {
    this.stepperService.specialty$.subscribe((s) => (this.specialty = s));
    this.stepperService.doctor$.subscribe((d) => (this.doctor = d));
  }
}
