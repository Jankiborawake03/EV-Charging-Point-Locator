import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private baseUrl = 'http://localhost:8080/api/bookings';

  constructor(private http: HttpClient) {}

  getUserBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/user`);
  }

  getHostBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/host`);
  }

  getBookingById(bookingId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${bookingId}`);
  }

  createBooking(stationId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/create`, null, {
      params: { stationId }
    });
  }

  approveBooking(bookingId: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${bookingId}/approve`, {});
  }

  startCharging(bookingId: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${bookingId}/start`, {});
  }

  completeCharging(bookingId: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${bookingId}/complete`, {});
  }

  processPayment(bookingId: string, transactionId: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${bookingId}/pay`, { transactionId });
  }
}