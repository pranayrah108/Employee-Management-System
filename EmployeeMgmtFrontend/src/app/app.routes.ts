import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DepartmentsComponent } from './pages/departments/departments.component';
import { EmployeeComponent } from './pages/employee/employee.component';
import { LoginComponent } from './pages/login/login.component';
import { EmployeeDashboardComponent } from './pages/employee-dashboard/employee-dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LeavesComponent } from './pages/leaves/leaves.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';

export const routes: Routes = [
    {
        path:"",
        component: HomeComponent
    },
    {
        path:"employee-dashboard",
        component:EmployeeDashboardComponent
    },
    {
        path:"departments",
        component:DepartmentsComponent
    },
    {
        path:"employee",
        component:EmployeeComponent
    },
    {
        path:'login',
        component: LoginComponent
    },
    {
        path:'profile',
        component: ProfileComponent
    },
    {
        path:'leaves',
        component:LeavesComponent
    },
    {
        path:'attendance',
        component:AttendanceComponent
    },
    {
        path:'attendance/:id',
        component:AttendanceComponent
    }
];
