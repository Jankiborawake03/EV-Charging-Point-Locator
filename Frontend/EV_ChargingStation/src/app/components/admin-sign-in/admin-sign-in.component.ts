import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-sign-in',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-sign-in.component.html',
  styleUrl: './admin-sign-in.component.scss'
})

export class AdminSignInComponent {
  signInForm: FormGroup;
  showPassword = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  onSubmit() {
    if (this.signInForm.valid) {
      this.http.post('http://localhost:8080/api/auth/admin-sign-in', this.signInForm.value).subscribe(
        (response: any) => {
        
          localStorage.setItem('firstName', response.firstName);
          localStorage.setItem('lastName', response.lastName);
          localStorage.setItem('email', response.email);
          localStorage.setItem('role', 'Admin');
          
          
          this.router.navigate(['/admin-panel']); 
          this.successMessage = 'Sign in successful!';
          this.errorMessage = null;
        },
        (error) => {
          this.errorMessage = error.error?.message || 'Invalid email or password. Please try again.';
          this.successMessage = null;
        }
      );
    }
  }
}