import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/Auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  signInForm: FormGroup;
  hostSignInForm: FormGroup;
  showPassword = false;
  isEVOwner = true; 
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient,private authService:AuthService) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.hostSignInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

 
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  
  setUserType(type: string) {
    this.isEVOwner = type === 'evOwner';
  }

  
  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  onSubmit() {
    if (this.signInForm.valid) {
      const formData = { ...this.signInForm.value, role: 'EV Owner' }; 
      this.http.post('http://localhost:8080/api/auth/signin', formData).subscribe(
        (response: any) => {
          if (response && response.role === 'EV Owner') {
            localStorage.setItem('firstName', response.firstName);
            localStorage.setItem('lastName', response.lastName);
            localStorage.setItem('email', response.email);
            localStorage.setItem('role', response.role);

            this.router.navigate(['/']); 
          } else {
            this.errorMessage = 'Invalid role selection. Please select the correct user type.';
          }
        },
        (error) => {
          this.errorMessage = error.error?.error || 'Invalid email or password. Please try again.';
          this.successMessage = null;
        }
      );
    }
  }

  onHostSubmit() {
    if (this.hostSignInForm.valid) {
      const formData = { ...this.hostSignInForm.value, role: 'Station Host' }; // Ensure role is included
      this.http.post('http://localhost:8080/api/auth/signin', formData).subscribe(
        (response: any) => {
          if (response && response.role === 'Station Host') {
            localStorage.setItem('firstName', response.firstName);
            localStorage.setItem('lastName', response.lastName);
            localStorage.setItem('email', response.email);
            localStorage.setItem('role', response.role);

            this.router.navigate(['/host-panel']); 
          } else {
            this.errorMessage = 'Invalid role selection. Please select the correct user type.';
          }
        },
        (error) => {
          this.errorMessage = error.error?.error || 'Invalid email or password. Please try again.';
          this.successMessage = null;
        }
      );
    }
  }
}
