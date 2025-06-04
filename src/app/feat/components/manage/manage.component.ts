import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserAppointment } from '../../../interfaces/schedule.interface';
import { AppointmentService } from '../../../services/appointment.service';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
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
import {StepperService} from '../../../services/stepper.service';

@Component({
  selector: 'app-manage',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    DatePipe,
    NgIf,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    NgClass,
  ],
  templateUrl: './manage.component.html',
  standalone: true,
})
export class ManageComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'doctorName',
    'specialtyName',
    'date',
    'time',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<UserAppointment>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  readonly dialog = inject(MatDialog);

  constructor(
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar,
    private stepperService:StepperService
  ) {}

  ngOnInit(): void {
    this.appointmentService
      .getUserAppointments()
      .subscribe((res) => (this.dataSource.data = res.body ?? []));
    this.appointmentService.appointmentChanges$.subscribe(() => {
      this.appointmentService
        .getUserAppointments()
        .subscribe((res) => (this.dataSource.data = res.body ?? []));
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onDelete(element: UserAppointment) {
    const dialogRef = this.dialog.open(CancelAppointmentDialog, {
      data: element,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.appointmentService
          .cancelAppointment(element.appointmentId)
          .subscribe({
            next: () => {
              this.snackBar.open('Se ha cancelado la cita', 'Ok', {
                duration: 5000,
                panelClass: ['mb-5'],
                horizontalPosition: 'right',
                verticalPosition: 'top',
              });
              this.appointmentService.reloadAppointments()
            },
          });
      }
    });
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
}

@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: 'cancel-dialog.html',
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
export class CancelAppointmentDialog implements OnInit {
  readonly dialogRef = inject(MatDialogRef<CancelAppointmentDialog>);
  appointment: UserAppointment | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: UserAppointment) {}

  ngOnInit(): void {
    this.appointment = this.data;
  }
}
