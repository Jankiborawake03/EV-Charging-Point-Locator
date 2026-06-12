import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';

interface CheckoutSession {
  sessionId: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StripePaymentService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  createCheckoutSession(): Observable<CheckoutSession> {
    return this.http.post<CheckoutSession>(
      `${this.apiUrl}/api/payment/create-session`, 
      {}
    );
  }
}