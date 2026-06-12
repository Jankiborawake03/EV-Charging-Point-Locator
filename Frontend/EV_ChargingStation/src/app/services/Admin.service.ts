import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface ChargingStation {
  id: string;
  stationName: string;
  address: string;
  pinCode: string;
  latitude: number;
  longitude: number;
  imageBase64: string;
  isApproved: boolean;
  email?: string;
  
}

export interface EVNews {
  id?: string;
  title: string;
  content: string;
  imageUrl?: string;
  datePublished: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) { }

  getPendingStations(): Observable<ChargingStation[]> {
    return this.http.get<ChargingStation[]>(`${this.baseUrl}/pending-stations`)
      .pipe(
        catchError(error => {
          console.error('Error fetching pending stations:', error);
          return throwError(() => error);
        })
      );
  }

  approveStation(id: string): Observable<ChargingStation> {
    console.log(`Approving station with ID: ${id}`);
    return this.http.put<ChargingStation>(`${this.baseUrl}/approve/${id}`, {})
      .pipe(
        catchError(error => {
          console.error(`Error approving station ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  approveStationByEmail(email: string): Observable<ChargingStation> {
    console.log(`Approving station with email: ${email}`);
    // Updated to match backend endpoint
    return this.http.put<ChargingStation>(`${this.baseUrl}/approve-by-email/${email}`, {})
      .pipe(
        catchError(error => {
          console.error(`Error approving station by email ${email}:`, error);
          return throwError(() => error);
        })
      );
  }

  rejectStation(id: string): Observable<any> {
    console.log(`Rejecting station with ID: ${id}`);
    return this.http.delete(`${this.baseUrl}/reject/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error rejecting station ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  rejectStationByEmail(email: string): Observable<any> {
    console.log(`Rejecting station with email: ${email}`);
    // Add endpoint to reject by email (this endpoint needs to be added to backend)
    return this.http.delete(`${this.baseUrl}/reject-by-email/${email}`)
      .pipe(
        catchError(error => {
          console.error(`Error rejecting station by email ${email}:`, error);
          return throwError(() => error);
        })
      );
  }

  getAllNews(): Observable<EVNews[]> {
    return this.http.get<EVNews[]>(`${this.baseUrl}/news`)
      .pipe(
        catchError(error => {
          console.error('Error fetching news:', error);
          return throwError(() => error);
        })
      );
  }

  addNews(news: EVNews): Observable<EVNews> {
    return this.http.post<EVNews>(`${this.baseUrl}/news`, news)
      .pipe(
        catchError(error => {
          console.error('Error adding news:', error);
          return throwError(() => error);
        })
      );
  }

  deleteNews(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/news/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error deleting news ${id}:`, error);
          return throwError(() => error);
        })
      );
  }
}