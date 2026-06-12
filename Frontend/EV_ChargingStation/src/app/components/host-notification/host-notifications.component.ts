import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/hostnotification.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-host-notifications',
  templateUrl: './host-notifications.component.html',
  styleUrls: ['./host-notifications.component.scss'],
})
export class HostNotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  recipientId: string = '';
  loading: boolean = false;
  error: string | null = null;
  statusFilter: string = 'ALL';
  customResponse: string = '';
  selectedNotification: Notification | null = null;
  showResponseDialog: boolean = false;
  refreshSubscription?: Subscription;
  responseAction: string = ''; // Added to track which action (APPROVE/REJECT) was selected

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Change from localStorage.getItem('userId') to localStorage.getItem('email')
    this.recipientId = localStorage.getItem('email') || '';

    if (this.recipientId) {
      this.fetchNotifications();

      // Set up auto-refresh with email as recipientId
      this.refreshSubscription = interval(30000)
        .pipe(
          switchMap(() =>
            this.notificationService.getNotificationsByRecipient(
              this.recipientId
            )
          )
        )
        .subscribe({
          next: (data) => {
            this.notifications = data;
            this.applyFilters();
          },
          error: (err) => {
            console.error('Error auto-refreshing notifications:', err);
          },
        });
    } else {
      this.error =
        'User email not found in local storage. Please sign in again.';
      console.error('User email not found in local storage');
    }
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  fetchNotifications(): void {
    if (!this.recipientId) {
      this.error = 'User email not found. Please sign in again.';
      return;
    }

    this.loading = true;
    this.error = null;

    this.notificationService
      .getNotificationsByRecipient(this.recipientId)
      .subscribe({
        next: (data) => {
          this.notifications = data;
          this.applyFilters();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching notifications:', err);
          this.error = 'Failed to load notifications. Please try again.';
          this.loading = false;
        },
      });
  }

  applyFilters(): void {
    if (this.statusFilter.toUpperCase() === 'ALL') {
      this.filteredNotifications = [...this.notifications];
    } else {
      this.filteredNotifications = this.notifications.filter(
        (n) => n.status.toUpperCase() === this.statusFilter.toUpperCase()
      );
    }

    this.filteredNotifications.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  changeStatusFilter(status: string): void {
    this.statusFilter = status.toUpperCase();
    this.applyFilters();
  }

  
  openResponseDialog(
    notification: Notification,
    action: string = 'APPROVED'
  ): void {
    this.selectedNotification = notification;
    this.responseAction = action.toUpperCase();
    this.customResponse =
      notification.status.toUpperCase() === 'PENDING'
        ? ''
        : notification.responseMessage || '';
    this.showResponseDialog = true;
  }

  closeResponseDialog(): void {
    this.showResponseDialog = false;
    this.selectedNotification = null;
    this.customResponse = '';
    this.responseAction = '';
  }

  respond(notificationId: string, status: string): void {
    const responseMessage =
      this.customResponse ||
      (status.toUpperCase() === 'APPROVED'
        ? 'Approved by host'
        : 'Rejected by host');

    this.loading = true;
    this.notificationService
      .respondToNotification(
        notificationId,
        status,
        responseMessage,
        this.recipientId
      )
      .subscribe({
        next: () => {
          this.fetchNotifications();
          this.closeResponseDialog();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error responding to notification:', err);
          this.error = 'Failed to respond to notification. Please try again.';
          this.loading = false;
        },
      });
  }

  markAllAsRead(): void {
    this.notificationService
      .markAllAsReadByRecipient(this.recipientId)
      .subscribe({
        next: () => {
          this.fetchNotifications();
        },
        error: (err) => {
          console.error('Error marking all as read:', err);
          this.error = 'Failed to mark all as read. Please try again.';
        },
      });
  }

  getStatusColor(status: string): string {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return 'green';
      case 'REJECTED':
        return 'red';
      case 'PENDING':
        return 'orange';
      default:
        return 'gray';
    }
  }

  getStatusIcon(status: string): string {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return '✓';
      case 'REJECTED':
        return '✗';
      case 'PENDING':
        return '⏳';
      default:
        return '?';
    }
  }

  checkStatusIsApproved(status: string): boolean {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return true;
      default:
        return false;
    }
  }

  checkStatusIsPending(status: string): boolean {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return true;
      default:
        return false;
    }
  }

  checkStatusIsRejected(status: string): boolean {
    switch (status.toUpperCase()) {
      case 'REJECTED':
        return true;
      default:
        return false;
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  }
}
