import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ApplyLeaveComponent } from '../../components/apply-leave/apply-leave.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-employee-dashboard',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.scss',
})
export class EmployeeDashboardComponent {
  applyLeave() {
    this.openDialog();
  }

  readonly dialog = inject(MatDialog);
  openDialog(): void {
    let ref = this.dialog.open(ApplyLeaveComponent, {
      panelClass: 'm-auto',
      data: {},
    });

    ref.afterClosed().subscribe((result) => {
      // this.getLatestData();
    });
  }
}
