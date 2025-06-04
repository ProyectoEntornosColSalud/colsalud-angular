import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  LOCALE_ID,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppointmentService } from '../../../services/appointment.service';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import {
  AppointmentDetail,
  DoctorAppointment,
  GENDERS,
} from '../../../interfaces/schedule.interface';
import {
  AsyncPipe,
  DatePipe,
  KeyValuePipe,
  NgClass,
  NgForOf,
  NgIf,
  registerLocaleData,
} from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import esCO from '@angular/common/locales/es-CO';
import { MatButtonModule } from '@angular/material/button';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

registerLocaleData(esCO);

@Component({
  selector: 'app-doctor-view',
  imports: [
    MatPaginatorModule,
    AsyncPipe,
    MatCardModule,
    DatePipe,
    NgForOf,
    MatButtonModule,
    MatChipsModule,
    KeyValuePipe,
    FormsModule,
    NgIf,
    MatIconModule,
    NgClass,
  ],
  templateUrl: './doctor-view.component.html',
  standalone: true,
  styleUrl: './doctor-view.component.css',
  providers: [{ provide: LOCALE_ID, useValue: 'es-CO' }],
})
export class DoctorViewComponent implements OnInit, AfterViewInit {
  doctorAppointments$: Observable<DoctorAppointment[]> = of([]);
  groupedAppointments$: Observable<Record<string, DoctorAppointment[]>> = of(
    {},
  );
  thereIsContent = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  totalAppointments = 0;
  selectedFilter: 'TODAY' | 'PENDING' | 'PAST' = 'TODAY';

  constructor(
    private appointmentService: AppointmentService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.fetchAppointments('TODAY', 0, 28);
  }

  ngAfterViewInit(): void {}

  fetchAppointments(
    searchType: 'TODAY' | 'PENDING' | 'PAST',
    page: number,
    size: number,
  ): void {
    this.appointmentService
      .getDoctorAppointments(searchType, page, size)
      .subscribe({
        next: (res) => {
          const body = res.body;
          this.thereIsContent = body?.content && body.content.length > 0;
          const appointments = body?.content ?? [];
          this.totalAppointments = body?.totalElements ?? 0;
          this.doctorAppointments$ = of(appointments);
          this.groupedAppointments$ = of(this.groupByDay(appointments));
        },
      });
  }

  private groupByDay(
    appointments: DoctorAppointment[],
  ): Record<string, DoctorAppointment[]> {
    return appointments.reduce(
      (acc, appt) => {
        const date = new Date(appt.startTime).toLocaleDateString('es-CO', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });

        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(appt);
        return acc;
      },
      {} as Record<string, DoctorAppointment[]>,
    );
  }

  handlePageEvent(event: PageEvent) {
    console.log(event);
    this.thereIsContent = true;
    this.fetchAppointments(
      this.selectedFilter,
      event.pageIndex,
      event.pageSize,
    );
  }

  handleFilterChange(event: MatChipListboxChange) {
    this.thereIsContent = true;
    this.fetchAppointments(event.value, 0, 28);
  }

  getColorText(status: string) {
    switch (status) {
      case 'PERDIDA':
        return 'text-red-500';
      case 'ASISTIDA':
        return 'text-green-500';
      case 'PENDIENTE':
        return 'text-yellow-500';
      default:
        return '';
    }
  }

  onCardClick(appointmentId: number) {
    this.appointmentService.getAppointmentDetail(appointmentId).subscribe({
      next: (res) => {
        const dialogRef = this.dialog.open(MarkAttendedDialog, {
          data: res.body,
          width: '500px',
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.appointmentService.markAsAttended(appointmentId).subscribe({
              next: () => {
                this.snackbar.open('Se marcó la cita como asistida', 'Ok', {
                  duration: 5000,
                  panelClass: ['mb-5'],
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
                });
                this.fetchAppointments(this.selectedFilter, 0, 28);
              },
            });
          }
        });
      },
    });
  }
}

@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: 'mark-attended-dialog.html',
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    DatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class MarkAttendedDialog implements OnInit {
  readonly dialogRef = inject(MatDialogRef<MarkAttendedDialog>);
  appointment: AppointmentDetail | null = null;

  readonly genders = GENDERS;

  constructor(@Inject(MAT_DIALOG_DATA) public data: AppointmentDetail) {}

  ngOnInit(): void {
    this.appointment = this.data;
  }

  calculateAge(dob: string | undefined) {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  getGenderValue(gender: string | undefined): string {
    if (!gender) return 'No especificado';
    return (
      GENDERS.filter((g) => g.value === gender)[0]?.viewValue ||
      'No especificado'
    );
  }
}
