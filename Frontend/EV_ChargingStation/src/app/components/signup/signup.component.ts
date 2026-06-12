// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { Router, RouterModule } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-signup',
//   standalone: true,
//   imports: [ReactiveFormsModule, RouterModule, CommonModule],
//   templateUrl: './signup.component.html',
//   styleUrl: './signup.component.scss'
// })
// export class SignupComponent {
//   signupForm: FormGroup;
//   hostSignupForm: FormGroup;
//   showPassword = false;
//   isEVOwner = true; // Default selection is EV Owner
//   successMessage: string = '';
//   errorMessage: string = '';

//   constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
//     // Initialize EV Owner Signup Form
//     this.signupForm = this.fb.group({
//       firstName: ['', Validators.required],
//       lastName: ['', Validators.required],
//       contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]]
//     });

//     // Initialize Host Signup Form
//     this.hostSignupForm = this.fb.group({
//       firstName: ['', Validators.required],
//       lastName: ['', Validators.required],
//       contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]]
//     });
//   }

//   setUserType(type: string) {
//     this.isEVOwner = type === 'evOwner';
//   }

//   togglePasswordVisibility() {
//     this.showPassword = !this.showPassword;
//   }

//   onSignup() {
//     if (this.signupForm.valid) {
//       const formData = { ...this.signupForm.value, role: 'EV Owner' };
//       this.http.post('http://localhost:8080/api/auth/signup', this.signupForm.value).subscribe(
//         (response: any) => {
//           this.successMessage = 'Registration successful!';
//           this.errorMessage = '';
//           setTimeout(() => {
//             this.router.navigate(['/sign-in']);
//           }, 2000);
//         },
//         (error) => {
//           this.successMessage = '';
//           this.errorMessage = error.error?.message || 'Signup failed. Please try again.';
//         }
//       );
//     }
//   }

//   onHostSignup() {
//     if (this.hostSignupForm.valid) {
//       const formData = { ...this.hostSignupForm.value, role: 'Station Host' };
//       this.http.post('http://localhost:8080/api/auth/signup', this.hostSignupForm.value).subscribe(
//         (response: any) => {
//           this.successMessage = 'Host registration successful!';
//           this.errorMessage = '';
//           setTimeout(() => {
//             this.router.navigate(['/sign-in']);
//           }, 2000);
//         },
//         (error) => {
//           this.successMessage = '';
//           this.errorMessage = error.error?.message || 'Signup failed. Please try again.';
//         }
//       );
//     }
//   }
// }


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm: FormGroup;
  hostSignupForm: FormGroup;
  showPassword: boolean = false;
  isEVOwner = true; // Default selection is EV Owner
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    // Initialize EV Owner Signup Form
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Initialize Host Signup Form
    this.hostSignupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  setUserType(type: string) {
    this.isEVOwner = type === 'evOwner';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    console.log("Password visibility toggled:", this.showPassword);
  }

  onSignup() {
    if (this.signupForm.valid) {
      const formData = { ...this.signupForm.value, role: 'EV Owner' }; // Set role explicitly
      this.http.post('http://localhost:8080/api/auth/signup', formData).subscribe(
        (response: any) => {
          this.successMessage = 'Registration successful!';
          this.errorMessage = '';
          setTimeout(() => {
            this.router.navigate(['/sign-in']);
          }, 2000);
        },
        (error) => {
          this.successMessage = '';
          this.errorMessage = error.error?.message || 'Signup failed. Please try again.';
        }
      );
    }
  }

  onHostSignup() {
    if (this.hostSignupForm.valid) {
      const formData = { ...this.hostSignupForm.value, role: 'Station Host' }; // Set role explicitly
      this.http.post('http://localhost:8080/api/auth/signup-host', formData).subscribe(
        (response: any) => {
          this.successMessage = 'Host registration successful!';
          this.errorMessage = '';
          setTimeout(() => {
            this.router.navigate(['/sign-in']);
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
