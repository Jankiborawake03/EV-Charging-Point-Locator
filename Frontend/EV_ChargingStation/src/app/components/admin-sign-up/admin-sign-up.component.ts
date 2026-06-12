import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './admin-sign-up.component.html',
  styleUrl: './admin-sign-up.component.scss'
})
export class AdminSignupComponent {
  signupForm: FormGroup;
  showPassword: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignup() {
    if (this.signupForm.valid) {
      const formData = { ...this.signupForm.value };
      this.http.post('http://localhost:8080/api/auth/admin-sign-up', formData).subscribe(
        (response: any) => {
          this.successMessage = 'Registration successful!';
          this.errorMessage = '';
          setTimeout(() => {
            this.router.navigate(['/admin-sign-in']);
          }, 2000);
        },
        (error) => {
          this.successMessage = '';
          this.errorMessage = error.error?.message || 'Signup failed. Please try again.';
        }
      );
    }
  }
}