import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IDashboard } from '../types/dashboard';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  http = inject(HttpClient);

  constructor() {}

  getDashboardData() {
    return this.http.get<IDashboard>(environment.apiUrl + '/api/Dashboard/dashboard');
  }
}
