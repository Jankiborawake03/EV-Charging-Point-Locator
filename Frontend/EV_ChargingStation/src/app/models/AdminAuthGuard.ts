
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  
  constructor(private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');
    
    if (email && role === 'Admin') {
      return true;
    }
    
   
    this.router.navigate(['/admin-sign-in']);
    return false;
  }
}