import { Component, OnInit } from '@angular/core';
import { StepperService } from '../../../../services/stepper.service';
import { Doctor, Specialty } from '../../../../interfaces/schedule.interface';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-confirm',
  imports: [DatePipe],
  templateUrl: './confirm.component.html',
  standalone: true,
  styles: ``,
})
export class ConfirmComponent implements OnInit {
  specialty: Specialty | null = null;
  doctor: Doctor | null = null;
  date: Date | null = new Date();
  time: string | null = "10:00 AM";

  constructor(private stepperService: StepperService) {}

  ngOnInit() {
    this.stepperService.specialty$.subscribe((s) => (this.specialty = s));
    this.stepperService.doctor$.subscribe((d) => (this.doctor = d));
  }
}
