import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { BookingService } from '../../services/booking.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  user: any = null;
  email: string = '';
  currentDate = new Date().toLocaleDateString();
  selectedFile: File | null = null;
  activeTab: string = 'profile';
  bookings: any[] = [];
  notifications: any[] = [];
  filteredNotifications: any[] = []; 
  userReviews: any[] = [];
  notificationStatusFilter: string = 'all';
  notificationTypeFilter: string = 'all';
  reviewsSubTab: string = 'your-reviews';

  constructor(
    private userService: UserService, 
    private bookingService: BookingService,
    private notificationService: NotificationService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  private toCamelCase(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  ngOnInit() {
        const role = localStorage.getItem('role');
    if (role !== 'EV Owner') {
      this.router.navigate(['/sign-in']);
      return;
    }
    
    this.email = localStorage.getItem('email') || ''; 
    
    if (this.email) {
      this.loadUserProfile();
      this.loadBookings();
      this.loadNotificationHistory();
    } else {
      this.router.navigate(['/sign-in']); 
    }
  }

  loadUserProfile() {
    this.userService.getUserByEmail(this.email).subscribe(
      user => {
        this.user = user;
      },
      error => {
        console.error('Error loading user profile', error);
        
      }
    );
  }

  loadBookings() {
    this.bookingService.getUserBookings().subscribe(
      bookings => {
        this.bookings = bookings;
        
        this.bookings.sort((a, b) => {
          return new Date(b.bookingTime).getTime() - new Date(a.bookingTime).getTime();
        });
      },
      error => {
        console.error('Error loading bookings', error);
      }
    );
  }

  loadNotificationHistory() {
    
    this.notificationService.getNotificationsBySenderEmail(this.email).subscribe(
      notifications => {
        this.notifications = notifications;
     
        this.notifications.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        this.applyNotificationFilters();
      },
      error => {
        console.error('Error loading notification history', error);
      }
    );
  }

  applyNotificationFilters() {
    this.filteredNotifications = this.notifications.filter(notification => {
      const statusMatch = this.notificationStatusFilter === 'all' || notification.status === this.notificationStatusFilter;
      const typeMatch = this.notificationTypeFilter === 'all' || notification.type === this.notificationTypeFilter;
      return statusMatch && typeMatch;
    });
  }

  getCompletedBookings() {
    return this.bookings.filter(booking => 
      booking.status === 'completed' && booking.paymentStatus === 'paid'
    );
  }

  getPendingReviewBookings() {
   
    return this.bookings.filter(booking => 
      booking.status === 'completed' && 
      booking.paymentStatus === 'paid' && 
      !this.hasUserReviewedBooking(booking.id)
    );
  }

  hasUserReviewedBooking(bookingId: string): boolean {
        return false;
  }

  getTotalPaidAmount(): number {
    return this.getCompletedBookings().reduce((total, booking) => total + booking.amount, 0);
  }

  getChargingDuration(booking: any): string {
    if (!booking.chargingStartTime || !booking.chargingEndTime) {
      return 'N/A';
    }
    
    const startTime = new Date(booking.chargingStartTime);
    const endTime = new Date(booking.chargingEndTime);
    const durationMs = endTime.getTime() - startTime.getTime();
    
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  }

  viewReceipt(booking: any) {
   
    alert(`Viewing receipt for booking: ${booking.id}\nAmount: $${booking.amount.toFixed(2)}\nTransaction ID: ${booking.paymentTransactionId}`);
   
  }

  writeReview(booking: any) {
   
    alert(`Writing review for station: ${booking.stationName}`);
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  setReviewsSubTab(subTab: string) {
    this.reviewsSubTab = subTab;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; 

      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a valid image (JPEG, PNG, GIF, WebP)');
        return;
      }

      if (file.size > maxSize) {
        alert('File size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        this.uploadProfilePhoto(base64String);
      };
    }
  }

  uploadProfilePhoto(base64Image: string) {
    this.userService.uploadProfilePhoto(this.email, base64Image).subscribe(
      response => {
        this.user.profilePhoto = base64Image;
        alert('Profile photo updated successfully');
      },
      error => {
        console.error('Error uploading profile photo', error);
        alert('Failed to upload profile photo');
      }
    );
  }
  
  logout() {
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    this.router.navigate(['/sign-in']);
  }
}