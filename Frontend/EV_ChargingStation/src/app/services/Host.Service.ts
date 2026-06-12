import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ChargingStation } from '../models/charging-station.model';
import { Booking } from '../models/booking.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class HostService {
  private baseUrl = 'http://localhost:8080/api/host';

  constructor(private http: HttpClient) {}

    private getEmail(): string {
    return localStorage.getItem('email') || '';
  }

    private createRequestOptions(): Object {
    const email = this.getEmail();
    const params = new HttpParams().set('email', email);
    return { params };
  }

  
  getHostDetails(): Observable<User> {
    const options = this.createRequestOptions();
    return this.http.get<User>(`${this.baseUrl}/details`, options).pipe(
      catchError(error => {
        console.error('Error fetching host details', error);
        return throwError(() => new Error('Failed to fetch host details: ' + this.getErrorMessage(error)));
      })
    );
  }

  
  updateProfile(hostDetails: User): Observable<User> {
    const options = this.createRequestOptions();
    return this.http.put<User>(`${this.baseUrl}/profile`, hostDetails, options).pipe(
      catchError(error => {
        console.error('Error updating profile', error);
        return throwError(() => new Error('Failed to update profile: ' + this.getErrorMessage(error)));
      })
    );
  }

  
  uploadProfilePhoto(email: string, base64Image: string): Observable<string> {
    const payload = {
      profilePhoto: base64Image
    };
    
    const options = this.createRequestOptions();
    return this.http.post<any>(`${this.baseUrl}/upload-photo`, payload, options).pipe(
      map(response => response.photoUrl || ''),
      catchError(error => {
        console.error('Error uploading profile photo', error);
        return throwError(() => new Error('Failed to upload profile photo: ' + this.getErrorMessage(error)));
      })
    );
  }

  
  getHostStations(): Observable<ChargingStation[]> {
    const options = this.createRequestOptions();
    return this.http.get<ChargingStation[]>(`${this.baseUrl}/stations`, options).pipe(
      map(response => {
       
        if (Array.isArray(response)) {
          return response;
        } else if (response) {
          return [response as ChargingStation];
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching host stations', error);
        if (error.status === 500) {
          console.warn('Server error when fetching stations, returning empty array');
          return of([]);
        }
        return throwError(() => new Error('Failed to fetch stations: ' + this.getErrorMessage(error)));
      })
    );
  }

  
  getHostBookings(): Observable<Booking[]> {
    const options = this.createRequestOptions();
    return this.http.get<Booking[]>(`${this.baseUrl}/bookings`, options).pipe(
      map(response => {

        if (Array.isArray(response)) {
          return response;
        } else if (response) {
          return [response as Booking];
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching host bookings', error);
        
        if (error.status === 500) {
          console.warn('Server error when fetching bookings, returning empty array');
          return of([]);
        }
        return throwError(() => new Error('Failed to fetch bookings: ' + this.getErrorMessage(error)));
      })
    );
  }

  
  addStation(stationDetails: ChargingStation): Observable<User> {
    const options = this.createRequestOptions();
    return this.http.post<User>(`${this.baseUrl}/stations`, stationDetails, options).pipe(
      catchError(error => {
        console.error('Error adding station', error);
        return throwError(() => new Error('Failed to add station: ' + this.getErrorMessage(error)));
      })
    );
  }

  
  toggleStationActivation(stationId: string): Observable<any> {
    const options = this.createRequestOptions();
    return this.http.put<any>(`${this.baseUrl}/stations/${stationId}/toggle-activation`, {}, options).pipe(
      catchError(error => {
        console.error('Error toggling station activation', error);
        return throwError(() => new Error('Failed to toggle station: ' + this.getErrorMessage(error)));
      })
    );
  }


  completeCharging(bookingId: string): Observable<any> {
    const options = this.createRequestOptions();
    return this.http.put<any>(`${this.baseUrl}/bookings/${bookingId}/complete`, {}, options).pipe(
      catchError(error => {
        console.error('Error completing charging', error);
        return throwError(() => new Error('Failed to complete charging: ' + this.getErrorMessage(error)));
      })
    );
  }

  
  private getErrorMessage(error: any): string {
    if (error.error && typeof error.error === 'object') {
      return error.error.error || error.error.message || error.message || 'Unknown error';
    }
    return error.message || 'Unknown error';
  }
}