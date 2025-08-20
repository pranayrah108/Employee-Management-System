import { Component, inject } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { TableComponent } from '../../components/table/table.component';
import { IEmployee } from '../../types/employee';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
} from '@angular/material/dialog';
import {MatFormField, MatInputModule} from '@angular/material/input';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { PagedData } from '../../types/paged-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee',
  imports: [
    TableComponent,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormField
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
})
export class EmployeeComponent {
  httpService = inject(HttpService);
  pagedEmployeeData!: PagedData<IEmployee>;
  showCols = ['id', 'name', 'email', 'phone',{
    key:'action',
    format:()=>{
      return ["Edit","Delete","Attendance"]
    }
  }];
  filter:any={
    pageIndex:0,
    pageSize:2
  };

  ngOnInit() {
    this.getLatestData();
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe((result:string | null)=>{
      console.log(result);
      this.filter.search = result;
      this.filter.pageIndex = 0;
      this.getLatestData();
    })
  }

  searchControl = new FormControl('');
  totalData!:number;

  getLatestData(){
    this.httpService.getEmployeeList(this.filter).subscribe((result) => {
      this.pagedEmployeeData = result;
    });
  }

  edit(employee: IEmployee) {
    console.log(employee);
    let ref = this.dialog.open(EmployeeFormComponent, {
        panelClass:'m-auto',
        data:{
          employeeId:employee.id
        }
    });

    ref.afterClosed().subscribe(result=>{
      this.getLatestData();
    })
  }

  delete(employee: IEmployee) {
    console.log(employee);
    this.httpService.deleteEmployee(employee.id).subscribe(()=>{
      alert('Record Deleted');
      this.getLatestData();
    })
  }

  add() {
    this.openDialog();
  }

  readonly dialog = inject(MatDialog);
  openDialog(): void {
    let ref = this.dialog.open(EmployeeFormComponent, {
        panelClass:'m-auto',
        data:{}
    });

    ref.afterClosed().subscribe(result=>{
      this.getLatestData();
    })
  }


  pageChange(event:any) {
    console.log(event);
    this.filter.pageIndex = event.pageIndex;
       this.getLatestData();
  }

  router = inject(Router);

  OnRowClick(event:any){
    if(event.btn==="Edit"){
      this.edit(event.rowData)
    }
    if(event.btn==="Delete"){
      this.delete(event.rowData);
    }
    if(event.btn==="Attendance"){
      this.router.navigateByUrl("/attendance/"+event.rowData.id);
    }
  }
}
