import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { ForgotPasswordService } from '../../services/forgot-password.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-forgot-password',
  imports: [RouterModule,CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
// export class ForgotPasswordComponent {
//   email: string = '';

//   constructor(private forgotPasswordService: ForgotPasswordService) {}

//   sendResetEmail() {
//     this.forgotPasswordService.forgotPassword(this.email).subscribe({
//       next: () => alert('Reset link sent to your email.'),
//       error: () => alert('Error sending reset email. Please try again.')
//     });
//   }
  
// }
export class ForgotPasswordComponent {
  email: string = '';
  otp: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  step: number = 1;
  emailError: string = '';
  passwordError: string = '';
  otpError: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient) {}

  // Step 1: Request OTP
  sendOtp() {
    if (!this.email) {
      this.emailError = 'Email is required';
      return;
    }
  
    this.http.post<{ message: string }>('http://localhost:8080/api/auth/forgot-password', { email: this.email })
      .subscribe({
        next: (response) => {
          console.log('Success Response:', response);
          this.step = 2; // Move to Step 2
          this.emailError = '';
        },
        error: (error) => {
          console.error('Error Response:', error);
          this.emailError = error.error?.message || 'User not found';
        }
      });
  }
  // Step 2: Reset Password with OTP
  resetPassword() {
    if (!this.otp || !this.newPassword || !this.confirmPassword) {
      this.passwordError = 'All fields are required';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Passwords do not match';
      return;
    }
  
    this.http.post<{ message: string }>('http://localhost:8080/api/auth/reset-password', { 
        email: this.email, 
        otp: this.otp, 
        newPassword: this.newPassword 
      }).subscribe({
        next: (response) => {
          console.log('Success Response:', response);
          this.step = 3;
          this.successMessage = response.message; // ✅ Use JSON response
        },
        error: (error) => {
          console.error('Error Response:', error);
          this.otpError = error.error?.message || 'Invalid or expired OTP';
        }
    });
  }
}