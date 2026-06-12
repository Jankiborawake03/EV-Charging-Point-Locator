import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccessService {
  private authStatusSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  authStatus = this.authStatusSubject.asObservable();

  constructor() {}

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('userToken'); // Convert to boolean
  }

  // Update login status for components
  updateAuthStatus(status: boolean) {
    this.authStatusSubject.next(status);
  }

  // Call this method after successful login
  login(userToken: string) {
    localStorage.setItem('userToken', userToken);
    this.updateAuthStatus(true); // Notify header & other components
  }

  // Logout method
  logout(): void {
    localStorage.removeItem('userToken');
    this.updateAuthStatus(false); // Notify components
  }
}
