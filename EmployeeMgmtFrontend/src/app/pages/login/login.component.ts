import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  loginForm!: FormGroup;
  router = inject(Router);

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
    if(this.authService.isLoggedIn) {
      this.router.navigateByUrl("/");
    }
  }

  onLogin() {
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe((result) => {
      console.log(result);
      this.authService.saveToken(result);
      if(result.role == 'Admin'){
        this.router.navigateByUrl('/');
      } else {
        this.router.navigateByUrl("/employee-dashboard");
      }
      
    });
  }

  
}
