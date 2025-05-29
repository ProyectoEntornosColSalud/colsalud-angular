import { Component, OnInit } from '@angular/core';
import { StepperService } from '../../../../services/stepper.service';
import { Doctor, Specialty } from '../../../../interfaces/schedule.interface';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AppointmentService } from '../../../../services/appointment.service';
import {formatLocalISO} from '../../../../util/tools';

@Component({
  selector: 'app-confirm',
  imports: [DatePipe, MatButtonModule],
  templateUrl: './confirm.component.html',
  standalone: true,
  styles: ``,
})
export class ConfirmComponent implements OnInit {
  specialty: Specialty | null = null;
  doctor: Doctor | null = null;
  selectedDate: Date | null = new Date();

  constructor(
    private stepperService: StepperService,
    private appointmentService: AppointmentService,
  ) {}

  ngOnInit() {
    this.stepperService.specialty$.subscribe((s) => (this.specialty = s));
    this.stepperService.doctor$.subscribe((d) => (this.doctor = d));
    this.stepperService.selectedTime$.subscribe((t) => {
      if (!t) return;
      this.selectedDate = new Date(t);
    });
  }

  schedule() {
    if (!this.doctor || !this.specialty || !this.selectedDate) {
      console.error('Doctor, specialty or date is not defined');
      return;
    }
    this.appointmentService
      .schedule(
        this.doctor.id,
        this.specialty.id,
        formatLocalISO(this.selectedDate),
      )
      .subscribe({
        next: () => {
          this.appointmentService.reloadAppointments();
          this.stepperService.reset();
        },
      });
  }

  protected readonly formatLocalISO = formatLocalISO;
}
