import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import {ScheduleComponent} from '../../components/schedule/schedule.component';
import {ManageComponent} from '../../components/manage/manage.component';

@Component({
  imports: [
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    ScheduleComponent,
    ManageComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home-page.component.html',
  standalone: true,
  styles: ``,
})
export class HomePageComponent {}
