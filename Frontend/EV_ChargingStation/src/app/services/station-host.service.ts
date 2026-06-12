import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StationService {
 
  private baseUrl = 'http://localhost:8080/api/stations';

  constructor(private http: HttpClient) { }

  submitStation(formData: FormData): Observable<any> {
    // Log all form data for debugging
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
    
    return this.http.post(`${this.baseUrl}/register`, formData)
      .pipe(
        catchError(error => {
          console.error('API Error:', error);
          return throwError(() => error);
        })
      );
  }

  getStationsByEmail(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/host/${email}`);
  }

  getStationById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getAllStations(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
}