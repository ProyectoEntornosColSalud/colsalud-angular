import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserAppointment } from '../../../interfaces/schedule.interface';
import { AppointmentService } from '../../../services/appointment.service';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

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

  constructor(private appointmentService: AppointmentService) {}

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

  onEdit(element: any) {}

  onFocus(element: any) {}

  onDelete(element: any) {}

  onFocusDelete(element: any) {}

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
