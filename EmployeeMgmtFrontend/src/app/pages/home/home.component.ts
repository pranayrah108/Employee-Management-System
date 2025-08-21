import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-home',
  imports: [MatCardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  salaryForMonth!: number;
  employeeCount!:number;
  departmentCount!:number;
  dashboardService = inject(DashboardService);
  ngOnInit() {
    this.dashboardService.getDashboardData().subscribe((result) => {
      this.salaryForMonth = result.totalSalary;
      this.employeeCount= result.employeeCount;
      this.departmentCount = result.departmentCount;
    });
  }
}
