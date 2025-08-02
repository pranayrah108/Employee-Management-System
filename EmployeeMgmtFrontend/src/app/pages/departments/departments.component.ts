import { Component, inject } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { IDepartment } from '../../types/department';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-departments',
  imports: [
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
  ],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss',
})
export class DepartmentsComponent {
  httpService = inject(HttpService);
  departments: IDepartment[] = [];
  isFormOpen: boolean = false;

  ngOnInit() {
    this.getLatestData();
  }

  getLatestData() {
    this.httpService.getDepartments().subscribe((result) => {
      this.departments = result;
    });
  }

  departmentName!: string;
  addDepartment() {
    this.httpService.addDepartment(this.departmentName).subscribe(() => {
      alert('Records Saved.');
      this.isFormOpen = false;
      this.getLatestData();
    });
  }

  editId=0;
  editDepartment(department: IDepartment) {
    this.departmentName = department.name;
    this.isFormOpen = true;
    this.editId = department.id;
  }

  UpdateDepartment(){
    this.httpService.updateDepartment(this.editId, this.departmentName).subscribe(()=>{
      alert("Record Saved.");
      this.isFormOpen = false;
      this.getLatestData();
      this.editId=0;
    })
  }

  delete(id:number){
    this.httpService.deletDepartment(id).subscribe(()=>{
      alert('Records Deleted.');
      this.getLatestData();
    })
  }
}
