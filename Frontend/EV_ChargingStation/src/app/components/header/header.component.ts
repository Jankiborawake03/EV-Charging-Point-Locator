import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  userFirstName: string = '';
  userLastName: string = '';
  isDropdownOpen: boolean = false;

  constructor(private router: Router, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');

    if (firstName && lastName) {
      this.isLoggedIn = true;
      this.userFirstName = this.toCamelCase(firstName);
      this.userLastName = this.toCamelCase(lastName);
    } else {
      this.isLoggedIn = false;
    }

    this.cdRef.detectChanges(); 
  }

  
  private toCamelCase(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    console.log('Logging out...');

    localStorage.clear();
    this.isLoggedIn = false;
    this.isDropdownOpen = false;

    setTimeout(() => {
      this.router.navigate(['/']);
      this.cdRef.markForCheck();
    }, 0);
  }
}
