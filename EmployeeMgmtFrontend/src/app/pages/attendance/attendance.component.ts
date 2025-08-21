import { Component, inject } from '@angular/core';
import { TableComponent } from '../../components/table/table.component';
import { LeaveService } from '../../services/leave.service';
import { PagedData } from '../../types/paged-data';
import { AttendanceType, IAttendance } from '../../types/attendace';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-attendance',
  imports: [TableComponent],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss',
})
export class AttendanceComponent {
  filter = {
    pageIndex: 0,
    pageSize: 5,
    employeeId:''
  };
  leaveService = inject(LeaveService);
  employeeId!:string | null;
  showCols:any[]=[
    {
      key:"date",
      format:(rowData:IAttendance)=>{
        let date = new Date(rowData.date);
        return date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
      }

    },
    {
      key:"type",
      format:(rowData:IAttendance)=>{
        switch(rowData.type){
          case AttendanceType.Leave:
            return "Leave";
          case AttendanceType.Present:
            return "Present";
        }
      }
    }
  ];

  route = inject(ActivatedRoute);
  ngOnInit() {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    this.getLatestData();
  }

  data!:PagedData<IAttendance>
  getLatestData() {
    
    if(this.employeeId){
      this.filter.employeeId = this.employeeId as string;
    }
    this.leaveService.getAttendanceHistory(this.filter).subscribe(result=>{
      this.data=result;
    })
  }

  pageChange(event: any) {
    console.log(event);
    this.filter.pageIndex = event.pageIndex;
    this.getLatestData();
  }
}
