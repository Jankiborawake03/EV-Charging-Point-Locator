import { Component } from '@angular/core';
import { FormBuilder,FormGroup,Validators,ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-contact-us',
  imports: [ReactiveFormsModule,HeaderComponent],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {
  contactForm: FormGroup;

  email = 'VoltWayev@gmail.com';
  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Form Submitted:', this.contactForm.value);
      alert('Your message has been sent successfully!');
      this.contactForm.reset();
    }
  }
}
