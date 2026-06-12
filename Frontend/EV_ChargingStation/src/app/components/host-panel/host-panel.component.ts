import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ChargingStation } from '../../models/charging-station.model';
import { Booking } from '../../models/booking.model';
import { HostService } from '../../services/Host.Service';
import { Notification } from '../../models/hostnotification.model';
import { NotificationService } from '../../services/notification.service';
import { HostNotificationsComponent } from '../host-notification/host-notifications.component';


@Component({
  selector: 'app-host-panel',
  standalone: true,
  imports: [CommonModule, FormsModule,HostNotificationsComponent],
  templateUrl: './host-panel.component.html',
  styleUrl: './host-panel.component.scss'
})
export class HostPanelComponent implements OnInit {
  hostDetails: any = {};
  stations: ChargingStation[] = [];
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  recentBookings: Booking[] = [];
  hasRegisteredStation: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  email: string = '';
  activeTab: string = 'dashboard';
  statusFilter: string = 'all';
  showBookingDetails: boolean = false;
  selectedBooking: Booking | null = null;
  isLoading: boolean = false;
  unreadNotificationsCount: number = 0;
notifications: Notification[] = [];

constructor(
  private http: HttpClient,
  private router: Router,
  private userService: UserService,
  private hostService: HostService,
  private notificationService: NotificationService
) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    if (role !== 'Station Host') {
      this.router.navigate(['/sign-in']);
      return;
    }

    this.email = localStorage.getItem('email') || '';
    if (!this.email) {
      this.router.navigate(['/sign-in']);
      return;
    }

    this.hostDetails = {
      firstName: localStorage.getItem('firstName'),
      lastName: localStorage.getItem('lastName'),
      email: this.email
    };

    this.loadHostProfile();
    this.fetchStations();
    this.fetchBookings();
    this.fetchNotificationsCount();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.clearMessages();
    
    if (tab === 'bookings') {
      this.fetchBookings();
    } else if (tab === 'stations') {
      this.fetchStations();
    } else if (tab === 'notifications') {
      this.fetchNotificationsCount();
    }
  }
  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  showSuccessMessage(message: string, duration: number = 3000): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, duration);
  }

  loadHostProfile() {
    this.isLoading = true;
    this.hostService.getHostDetails().subscribe(
      user => {
        this.hostDetails = { ...user };
        this.isLoading = false;
      },
      error => {
        console.error('Error loading host profile', error);
        this.errorMessage = 'Unable to fetch host profile. Please try again.';
        this.isLoading = false;
      }
    );
  }

  fetchStations() {
    this.isLoading = true;
    this.errorMessage = '';
    console.log('Fetching stations...');
    
    this.hostService.getHostStations().subscribe(
      (stations: ChargingStation[]) => {
        console.log('Received stations:', stations);
        this.stations = stations;
        this.hasRegisteredStation = this.stations.length > 0;
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching stations', error);
        this.errorMessage = 'Unable to fetch stations. Please try again.';
        this.isLoading = false;
      }
    );
  }

  fetchBookings() {
    this.isLoading = true;
    this.hostService.getHostBookings().subscribe(
      (data: Booking[]) => {
        // Map the backend properties to match what the template expects
        this.bookings = data.map(booking => ({
          ...booking,
          // Ensure both properties exist to fix template errors
          date: booking.bookingDate || booking.bookingDate,
          email: booking.userEmail || booking.userEmail
        }));
        this.filterBookings();
        this.recentBookings = this.bookings.slice(0, 5);
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching bookings', error);
        this.errorMessage = 'Unable to fetch bookings. Please ensure your host account is registered correctly.';
        this.isLoading = false;
      }
    );
  }

  filterBookings() {
    if (this.statusFilter === 'all') {
      this.filteredBookings = [...this.bookings];
    } else {
      // Case-insensitive comparison to handle status values correctly
      const statusValue = this.statusFilter.toUpperCase();
      this.filteredBookings = this.bookings.filter(
        booking => booking.status.toUpperCase() === statusValue
      );
    }
  }

  toggleStationStatus(stationId: string) {
    this.isLoading = true;
    this.clearMessages();
    
    console.log(`Attempting to toggle station ${stationId} status`);
    
    this.hostService.toggleStationActivation(stationId).subscribe(
      (response: any) => {
        console.log('Toggle response:', response);
        if (response.success) {
          // Find and update the station status in the UI
          const stationIndex = this.stations.findIndex(s => s.id === stationId);
          if (stationIndex !== -1) {
            this.stations[stationIndex].active = response.isActive;
            
            // Update the UI with visual feedback
            const status = response.isActive ? 'activated' : 'deactivated';
            this.showSuccessMessage(`Station ${this.stations[stationIndex].stationName} successfully ${status}`);
          }
        }
        this.isLoading = false;
      },
      error => {
        console.error('Error toggling station status', error);
        this.errorMessage = 'Failed to update station status: ' + (error.error?.error || 'Unknown error');
        this.isLoading = false;
      }
    );
  }

  getStationStatusClass(active: boolean): string {
    return active ? 'status-active' : 'status-inactive';
  }

  getStationStatusText(active: boolean): string {
    return active ? 'Active' : 'Inactive';
  }

  completeCharging(bookingId: string) {
    this.isLoading = true;
    this.clearMessages();
    
    this.hostService.completeCharging(bookingId).subscribe(
      (response: any) => {
        if (response.success) {
          this.showSuccessMessage(response.message);
          this.fetchBookings();
          if (this.showBookingDetails) {
            this.closeBookingDetails();
          }
        }
        this.isLoading = false;
      },
      error => {
        console.error('Error completing charging', error);
        this.errorMessage = 'Failed to complete charging: ' + (error.error?.error || 'Unknown error');
        this.isLoading = false;
      }
    );
  }

  viewBookingDetails(bookingId: string) {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (booking) {
      this.selectedBooking = booking;
      this.showBookingDetails = true;
    }
  }

  closeBookingDetails() {
    this.showBookingDetails = false;
    this.selectedBooking = null;
  }

  updateProfile() {
    this.isLoading = true;
    this.clearMessages();
    
    this.hostService.updateProfile(this.hostDetails).subscribe(
      (updatedHost: any) => {
        this.hostDetails = updatedHost;
        localStorage.setItem('firstName', updatedHost.firstName);
        localStorage.setItem('lastName', updatedHost.lastName);
        this.showSuccessMessage('Profile updated successfully');
        this.isLoading = false;
      },
      error => {
        console.error('Error updating profile', error);
        this.errorMessage = 'Failed to update profile: ' + (error.error?.error || 'Unknown error');
        this.isLoading = false;
      }
    );
  }

  manageStation(stationId: string) {
    // Find the station to manage
    const station = this.stations.find(s => s.id === stationId);
    if (station) {
      // Logic for managing station - for now show a message
      this.showSuccessMessage('Station management feature coming soon!');
    }
  }

  editStation(stationId: string) {
    // Find the station to edit
    const station = this.stations.find(s => s.id === stationId);
    if (station) {
      // Logic for editing station - for now show a message
      this.showSuccessMessage('Station editing feature coming soon!');
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/sign-in']);
  }

  navigateToStationHost() {
    if (!this.hasRegisteredStation) {
      this.router.navigate(['/station-host']);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024;
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

      if (file.size > maxSize) {
        this.errorMessage = 'File size cannot exceed 5MB';
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Invalid file type. Please upload JPEG, PNG, GIF, or WebP';
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
    this.isLoading = true;
    this.clearMessages();
    
    this.hostService.uploadProfilePhoto(this.email, base64Image).subscribe(
      () => {
        this.hostDetails.profilePhoto = base64Image;
        this.showSuccessMessage('Profile photo updated successfully');
        this.isLoading = false;
      },
      error => {
        console.error('Error uploading profile photo', error);
        this.errorMessage = error.error?.message || 'Failed to upload photo';
        this.isLoading = false;
      }
    );
  }

  fetchNotificationsCount(): void {
    
    const email = localStorage.getItem('email') || '';
    if (!email) {
      console.error('User email not found in local storage');
      return;
    }
    
    this.notificationService.getNotificationsByRecipient(email)
      .subscribe({
        next: (notifications) => {
          this.unreadNotificationsCount = notifications.filter(n => !n.read).length;
        },
        error: (err) => {
          console.error('Error fetching notifications count:', err);
        }
      });
  }
}