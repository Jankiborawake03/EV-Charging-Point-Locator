import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth'; 
  private currentUser: any = null;

  constructor(private http: HttpClient) {}

  login(user: any): Observable<any> {
    return new Observable((observer) => {
      this.http.post(`${this.baseUrl}/signin`, user).subscribe(
        (response: any) => {
          this.currentUser = response;
          this.setUser(response); 
          observer.next(response);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  
  setUser(user: any) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUser = user;
  }

  
  getUser(): any {
    if (!this.currentUser) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    }
    return this.currentUser;
  }

  
  isStationHost(): boolean {
    return this.getUser()?.role === 'Station Host';
  }

  
  isEVOwner(): boolean {
    return this.getUser()?.role === 'EV Owner';
  }

 
  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
  }
}
