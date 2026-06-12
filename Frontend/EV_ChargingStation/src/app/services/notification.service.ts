import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../models/hostnotification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private baseUrl = 'http://localhost:8080/api/notifications';

  constructor(private http: HttpClient) {}

  getNotificationsByRecipient(recipientId: string): Observable<Notification[]> {
    if (!recipientId) {
      throw new Error('Recipient ID is required');
    }
    return this.http.get<Notification[]>(
      `${this.baseUrl}/recipient/${recipientId}`
    );
  }

  getUnreadNotificationCount(
    recipientId: string
  ): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(
      `${this.baseUrl}/recipient/${recipientId}/unread-count`
    );
  }

  markAsRead(notificationId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${notificationId}/read`, {});
  }

  markAllAsReadByRecipient(recipientId: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/recipient/${recipientId}/read-all`,
      {}
    );
  }

  respondToNotification(
    notificationId: string,
    status: string,
    responseMessage: string,
    actionBy: string
  ): Observable<any> {
    return this.http.put(`${this.baseUrl}/${notificationId}/respond`, {
      status,
      responseMessage,
      actionBy,
    });
  }

  // New method for EV Owner profile - get notifications by sender email
  getNotificationsBySenderEmail(email: string): Observable<Notification[]> {
    if (!email) {
      throw new Error('Email is required');
    }
    return this.http.get<Notification[]>(
      `${this.baseUrl}/sender-by-email/${email}`
    );
  }

  // Alternative way to get notifications by sender ID
  getNotificationsBySenderId(senderId: string): Observable<Notification[]> {
    if (!senderId) {
      throw new Error('Sender ID is required');
    }
    return this.http.get<Notification[]>(
      `${this.baseUrl}/sender/${senderId}`
    );
  }
}