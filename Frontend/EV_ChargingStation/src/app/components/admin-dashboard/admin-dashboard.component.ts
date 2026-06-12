import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AdminService, ChargingStation, EVNews } from '../../services/Admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminPanelComponent implements OnInit {
  pendingStations: ChargingStation[] = [];
  newsTitle: string = '';
  newsContent: string = '';
  newsImageUrl: string = '';
  notification: { message: string, type: 'success' | 'error' } | null = null;
  isLoading: boolean = false;

  constructor(
    private adminService: AdminService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.fetchPendingStations();
  }

  fetchPendingStations(): void {
    this.isLoading = true;
    this.adminService.getPendingStations().subscribe({
      next: (stations) => {
        this.pendingStations = stations;
        console.log('Fetched stations:', stations);
        // Log the first image if exists to check format
        if (stations.length > 0 && stations[0].imageBase64) {
          console.log('First station image (preview):', stations[0].imageBase64.substring(0, 50) + '...');
        }
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.showNotification(`Error fetching pending stations: ${error.status} ${error.statusText}`, 'error');
        console.error('Error fetching pending stations', error);
        this.isLoading = false;
      }
    });
  }

  // New method to sanitize and handle different image formats
  sanitizeImage(imageBase64: string): SafeUrl {
    if (!imageBase64) return '';
    
    // Check if the base64 string already includes data URI scheme
    if (imageBase64.startsWith('data:')) {
      return this.sanitizer.bypassSecurityTrustUrl(imageBase64);
    }
    
    // Try to determine if the image is a PNG (rough check)
    // This is a simple heuristic - you might need more sophisticated detection
    const isPNG = imageBase64.startsWith('iVBOR') || imageBase64.includes('iVBOR');
    const mimeType = isPNG ? 'image/png' : 'image/jpeg';
    
    const safeUrl = this.sanitizer.bypassSecurityTrustUrl(`data:${mimeType};base64,${imageBase64}`);
    return safeUrl;
  }

  // Handle image loading errors
  handleImageError(event: any): void {
    console.error('Image failed to load', event);
    // Set a default image or hide the element
    event.target.style.display = 'none';
    // You could alternatively set a default image:
    // event.target.src = 'assets/default-station.png';
    
    // Show the "No image available" text when image fails to load
    const noImageElement = document.createElement('p');
    noImageElement.textContent = 'Image failed to load';
    noImageElement.className = 'error-image';
    event.target.parentElement.appendChild(noImageElement);
  }

  // Rest of your component methods (approveStation, rejectStation, etc.)
  approveStation(station: ChargingStation): void {
    // Debug information
    console.log('Approving station:', station);
    this.isLoading = true;
    
    // Try direct approval with ID first
    this.adminService.approveStation(station.id).subscribe({
      next: () => {
        this.pendingStations = this.pendingStations.filter(s => s.id !== station.id);
        this.showNotification('Station approved successfully', 'success');
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Direct ID approval error', error);
        
        // If that failed and we have an email, try by email
        if (station.email && station.email.trim() !== '') {
          this.approveStationByEmail(station);
        } else {
          this.showNotification(`Failed to approve station: ${error.status} ${error.statusText}`, 'error');
          console.error('Approval error', error);
          this.isLoading = false;
        }
      }
    });
  }

  private approveStationByEmail(station: ChargingStation): void {
    if (!station.email) return;
    
    this.adminService.approveStationByEmail(station.email).subscribe({
      next: () => {
        this.pendingStations = this.pendingStations.filter(s => s.id !== station.id);
        this.showNotification('Station approved successfully via email', 'success');
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.showNotification(`Failed to approve station: ${error.status} ${error.statusText}`, 'error');
        console.error('Email approval error', error);
        this.isLoading = false;
      }
    });
  }

  rejectStation(station: ChargingStation): void {
    // Debug information
    console.log('Rejecting station:', station);
    this.isLoading = true;
    
   
    this.adminService.rejectStation(station.id).subscribe({
      next: () => {
        this.pendingStations = this.pendingStations.filter(s => s.id !== station.id);
        this.showNotification('Station rejected successfully', 'success');
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Direct ID rejection error', error);
        
       
        if (station.email && station.email.trim() !== '') {
          this.rejectStationByEmail(station);
        } else {
          this.showNotification(`Failed to reject station: ${error.status} ${error.statusText}`, 'error');
          console.error('Rejection error', error);
          this.isLoading = false;
        }
      }
    });
  }

  private rejectStationByEmail(station: ChargingStation): void {
    if (!station.email) return;
    
    this.adminService.rejectStationByEmail(station.email).subscribe({
      next: () => {
        this.pendingStations = this.pendingStations.filter(s => s.id !== station.id);
        this.showNotification('Station rejected successfully via email', 'success');
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.showNotification(`Failed to reject station: ${error.status} ${error.statusText}`, 'error');
        console.error('Email rejection error', error);
        this.isLoading = false;
      }
    });
  }

  isNewsFormValid(): boolean {
    return this.newsTitle.trim() !== '' && this.newsContent.trim() !== '';
  }

  addNews(): void {
    if (!this.isNewsFormValid()) {
      this.showNotification('Please fill in all required fields', 'error');
      return;
    }

    this.isLoading = true;
    const newsData: EVNews = {
      title: this.newsTitle.trim(),
      content: this.newsContent.trim(),
      imageUrl: this.newsImageUrl ? this.newsImageUrl.trim() : undefined,
      datePublished: new Date()
    };

    this.adminService.addNews(newsData).subscribe({
      next: () => {
        this.showNotification('News added successfully', 'success');
        this.resetNewsForm();
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.showNotification(`Failed to add news: ${error.status} ${error.statusText}`, 'error');
        console.error('News submission error', error);
        this.isLoading = false;
      }
    });
  }

  private showNotification(message: string, type: 'success' | 'error'): void {
    this.notification = { message, type };
    
    setTimeout(() => {
      this.notification = null;
    }, 3000);
  }

  private resetNewsForm(): void {
    this.newsTitle = '';
    this.newsContent = '';
    this.newsImageUrl = '';
  }
}