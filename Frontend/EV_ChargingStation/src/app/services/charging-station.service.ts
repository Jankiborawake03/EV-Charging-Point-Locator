import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChargingStationService {
  private baseUrl = 'http://localhost:8080/api/fetch-stations';

  constructor(private http: HttpClient) { }

  getNearbyStations(lat: number, lng: number, radius: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/nearby`, {
      params: {
        lat: lat.toString(),
        lon: lng.toString(),
        radius: radius.toString()
      }
    });
  }

  notifyHost(stationId: string): Observable<any> {
    console.log('Sending notification request for station ID:', stationId);
    
    const firstName = localStorage.getItem('firstName') || '';
    const lastName = localStorage.getItem('lastName') || '';
    const userName = `${firstName} ${lastName}`.trim();
    const email = localStorage.getItem('email') || '';
    
    const notificationRequest = {
      email: email,
      userName: userName,
      message: `${userName} would like to use your charging station.`,
      requestType: 'BOOKING_REQUEST',
    };
    
    console.log('Notification request payload:', notificationRequest);
    
    return this.http.post(`${this.baseUrl}/notify-host`, notificationRequest, {
      params: { stationId }
    }).pipe(
      tap(response => console.log('Host notification successful:', response)),
      catchError(error => {
        console.error('Error in notifyHost:', error);
        
        if (error.error) {
          console.error('Server error details:', error.error);
        }
        return throwError(() => error);
      })
    );
  }

  processPayment(stationId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/process-payment`, {
      stationId: stationId,
      email: localStorage.getItem('email') || '',
      amount: 150 
    });
  }

  findStationByEmail(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/find`, {
      params: { email }
    });
  }

  findStationById(stationId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/find`, {
      params: { stationId }
    });
  }

  toggleStationStatus(stationId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/toggle-status/${stationId}`, {}).pipe(
      tap(response => console.log('Station status toggled:', response)),
      catchError(error => {
        console.error('Error toggling station status:', error);
        return throwError(() => error);
      })
    );
  }

  
checkNotificationStatus(notificationId: string): Observable<any> {

  return this.http.get(`http://localhost:8080/api/notifications/${notificationId}/getstatus`);

}
}