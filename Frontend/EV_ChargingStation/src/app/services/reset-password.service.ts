import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  private apiUrl = 'http://localhost:8080/api/auth/reset-password';

  constructor(private http: HttpClient) {}

  resetPassword(resetToken: string, newPassword: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { resetToken, newPassword });
  }
}
