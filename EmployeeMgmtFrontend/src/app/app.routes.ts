import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DepartmentsComponent } from './pages/departments/departments.component';
import { EmployeeComponent } from './pages/employee/employee.component';
import { LoginComponent } from './pages/login/login.component';
import { EmployeeDashboardComponent } from './pages/employee-dashboard/employee-dashboard.component';

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
    }
];
