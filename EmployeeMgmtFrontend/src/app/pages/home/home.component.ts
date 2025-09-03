import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DashboardService } from '../../services/dashboard.service';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { IDepartmentData } from '../../types/dashboard';
import { TableComponent } from '../../components/table/table.component';
import { ILeave, LeaveStatus, LeaveType } from '../../types/leave';
import { PagedData } from '../../types/paged-data';

@Component({
  selector: 'app-home',
  imports: [MatCardModule,BaseChartDirective, TableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  salaryForMonth!: number;
  employeeCount!:number;
  departmentCount!:number;
  dashboardService = inject(DashboardService);

  public barChartLegend = true;
  public barChartPlugins = [];
  departmentData!:IDepartmentData[];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Department Count' }],
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
  };

  ngOnInit() {
    this.dashboardService.getDashboardData().subscribe((result) => {
      this.salaryForMonth = result.totalSalary;
      this.employeeCount= result.employeeCount;
      this.departmentCount = result.departmentCount;
    });

    this.dashboardService.getDepartmentData().subscribe((result)=>{
      console.log("getDepartmentData():",result);
      this.barChartData.labels = result.map((x) => x.name);
      this.barChartData.datasets[0].data = result.map((x) => x.employeeCount);
      this.departmentData = result;
    });

    this.dashboardService.getTodayLeaveData().subscribe((result)=>{
      console.log("getTodayLeaveData:",result);
      this.leaveData={
        data:result,
        totalData:result.length,
      };
    });
  }

  leaveCols= [
      'employeeName',
      {
        key: 'type',
        format: (rowData: ILeave) => {
          switch (rowData.type) {
            case LeaveType.Casual:
              return 'Casual Leaves';
            case LeaveType.Sick:
              return 'Sick Leave';
            case LeaveType.Earned:
              return 'Earnerd Leave';
          }
        },
      },
      {
        key: 'status',
        format: (rowData: ILeave) => {
          switch (rowData.status) {
            case LeaveStatus.Pending:
              return 'Pending';
            case LeaveStatus.Rejected:
              return 'Rejected';
            case LeaveStatus.Accepted:
              return 'Accepted';
            case LeaveStatus.Cancelled:
              return 'Cancelled';
          }
        },
      },
    ];
  leaveData!: PagedData<ILeave>;
}
