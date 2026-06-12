import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  getUserByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${email}`);
  }

  uploadProfilePhoto(email: string, base64Image: string): Observable<any> {
    const formData = new FormData();
    
   
    const byteCharacters = atob(base64Image);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: 'image/jpeg'});
    
   
    formData.append('file', blob, 'profile-photo.jpg');

    
    const headers = new HttpHeaders();
    
    return this.http.post(`${this.baseUrl}/upload-photo/${email}`, formData, { 
      headers: headers,
      responseType: 'text' 
    });
  }
}