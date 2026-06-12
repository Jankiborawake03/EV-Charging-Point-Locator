import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StationService } from '../../services/station-host.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-station-host',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './station-host.component.html',
  styleUrls: ['./station-host.component.scss'],
  standalone: true
})
export class StationHostComponent implements OnInit, AfterViewInit {
  stationForm!: FormGroup;
  selectedFile: File | null = null;
  filePreview: string | ArrayBuffer | null = null;
  map: any;
  marker: any;
  userLat: number | null = null;
  userLng: number | null = null;
  loadingLocation: boolean = false; 
  locationSelected: boolean = false; 
  successMessage: string = "";
  userEmail: string = "";
  isSubmitting: boolean = false;

  constructor(private fb: FormBuilder, private stationService: StationService, private router: Router) {}

  ngOnInit(): void {
    // Get user email from localStorage
    this.userEmail = localStorage.getItem('email') || '';
    
    // Initialize form with new fields
    this.stationForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      pinCode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      email: [this.userEmail, [Validators.required, Validators.email]],
      // Vehicle types
      car: [false],
      bike: [false],
      // Charger types
      type1: [false],
      type2: [false],
      chademo: [false],
      ccs1: [false],
      ccs2: [false],
      tesla: [false]
    });
   
    // Detect user location
    this.detectUserLocation();
  }

  // Check if at least one vehicle type is selected
  isAnyVehicleTypeSelected(): boolean {
    return this.stationForm.get('car')?.value || this.stationForm.get('bike')?.value;
  }

  // Check if at least one charger type is selected
  isAnyChargerTypeSelected(): boolean {
    return this.stationForm.get('type1')?.value ||
           this.stationForm.get('type2')?.value ||
           this.stationForm.get('chademo')?.value ||
           this.stationForm.get('ccs1')?.value ||
           this.stationForm.get('ccs2')?.value ||
           this.stationForm.get('tesla')?.value;
  }

  ngAfterViewInit(): void {
    // Initialize map with a delay to ensure DOM is ready
    setTimeout(() => {
      if (!this.map) {
        this.initMap(this.userLat ?? 20.5937, this.userLng ?? 78.9629);
      }
    }, 500);
  }

  detectUserLocation(): void {
    this.loadingLocation = true; 

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.loadingLocation = false;
          this.userLat = position.coords.latitude;
          this.userLng = position.coords.longitude;

          this.stationForm.patchValue({
            latitude: this.userLat.toString(),  // Convert to string explicitly
            longitude: this.userLng.toString()  // Convert to string explicitly
          });

          this.locationSelected = true; 
          this.initMap(this.userLat, this.userLng);
          console.log(`📍 User Location Detected: Lat=${this.userLat}, Lng=${this.userLng}`);
          this.smoothScrollToMap();
        },
        (error) => {
          this.loadingLocation = false;
          console.error("Error getting user location:", error);
          this.showToast("⚠ Unable to detect location. Please select manually on the map.", "error");
          this.initMap(20.5937, 78.9629); // Default to India if location access is denied
        }
      );
    } else {
      this.loadingLocation = false;
      this.showToast("⚠ Geolocation is not supported by this browser.", "error");
      this.initMap(20.5937, 78.9629); // Default to India
    }
  }

  initMap(lat: number = 20.5937, lng: number = 78.9629): void {
    // Ensure the map element exists
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('Map element not found');
      return;
    }

    if (this.map) {
      this.map.remove();
      console.log("🗑️ Destroyed existing map instance.");
    }

    this.map = L.map('map').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    const markerIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    this.marker = L.marker([lat, lng], { icon: markerIcon }).addTo(this.map);
    this.marker.bindPopup("📍 Your Location").openPopup();

    this.map.on('click', (event: any) => {
      const newLat = event.latlng.lat;
      const newLng = event.latlng.lng;

      // Store as strings to avoid potential conversion issues
      this.stationForm.patchValue({ 
        latitude: newLat.toString(), 
        longitude: newLng.toString() 
      });

      this.locationSelected = true; // Enable submit button

      if (this.marker) {
        this.marker.setLatLng([newLat, newLng]);
      } else {
        this.marker = L.marker([newLat, newLng], { icon: markerIcon }).addTo(this.map);
      }

      console.log(`📍 Location Selected: Lat=${newLat}, Lng=${newLng}`);
    });
  }

  smoothScrollToMap(): void {
    document.getElementById("map")?.scrollIntoView({ behavior: "smooth" });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // Reduced to 5MB to avoid potential issues
        this.showToast("File size must be under 5MB for faster processing.", "error");
        event.target.value = '';
        this.selectedFile = null;
        this.filePreview = null;
        return;
      }
      
      if (!['image/png', 'image/jpeg'].includes(file.type)) {
        this.showToast("Only JPG and PNG images are allowed.", "error");
        event.target.value = '';
        this.selectedFile = null;
        this.filePreview = null;
        return;
      }
      
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.filePreview = e.target?.result ?? null;
      };
      reader.readAsDataURL(file);
    }
  }

  showToast(message: string, type: "success" | "error"): void {
    const toast = document.createElement("div");
    toast.innerText = message;
    toast.className = `toast ${type}`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // Get selected vehicle types as a comma-separated string
  getSelectedVehicleTypes(): string {
    const types: string[] = [];
    if (this.stationForm.get('car')?.value) types.push('Car');
    if (this.stationForm.get('bike')?.value) types.push('Bike');
    return types.join(',');
  }

  // Get selected charger types as a comma-separated string
  getSelectedChargerTypes(): string {
    const types: string[] = [];
    if (this.stationForm.get('type1')?.value) types.push('Type 1 (J1772)');
    if (this.stationForm.get('type2')?.value) types.push('Type 2 (Mennekes)');
    if (this.stationForm.get('chademo')?.value) types.push('CHAdeMO');
    if (this.stationForm.get('ccs1')?.value) types.push('CCS1');
    if (this.stationForm.get('ccs2')?.value) types.push('CCS2');
    if (this.stationForm.get('tesla')?.value) types.push('Tesla');
    return types.join(',');
  }

  submitStation(): void {
    if (this.isSubmitting) {
      return; // Prevent multiple submissions
    }
    
    if (this.stationForm.invalid) {
      this.showToast("Please fill all required fields correctly!", "error");
      Object.keys(this.stationForm.controls).forEach(key => {
        const control = this.stationForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }
  
    if (!this.selectedFile) {
      this.showToast("Please upload a station photo!", "error");
      return;
    }

    if (!this.isAnyVehicleTypeSelected()) {
      this.showToast("Please select at least one vehicle type!", "error");
      this.stationForm.get('car')?.markAsTouched();
      return;
    }

    if (!this.isAnyChargerTypeSelected()) {
      this.showToast("Please select at least one charger type!", "error");
      this.stationForm.get('type1')?.markAsTouched();
      return;
    }

    this.isSubmitting = true;
  
    const formData = new FormData();
    formData.append("stationName", this.stationForm.get('name')?.value);
    formData.append("address", this.stationForm.get('address')?.value);
    formData.append("pinCode", this.stationForm.get('pinCode')?.value);
    formData.append("latitude", this.stationForm.get('latitude')?.value);
    formData.append("longitude", this.stationForm.get('longitude')?.value);
    formData.append("photo", this.selectedFile);
    formData.append("email", this.userEmail);
    formData.append("vehicleTypes", this.getSelectedVehicleTypes());
    formData.append("chargerTypes", this.getSelectedChargerTypes());
    
    // Log data being sent
    console.log('Submitting station data:', {
      name: this.stationForm.get('name')?.value,
      address: this.stationForm.get('address')?.value,
      pinCode: this.stationForm.get('pinCode')?.value,
      latitude: this.stationForm.get('latitude')?.value,
      longitude: this.stationForm.get('longitude')?.value,
      email: this.userEmail,
      vehicleTypes: this.getSelectedVehicleTypes(),
      chargerTypes: this.getSelectedChargerTypes(),
      fileSize: this.selectedFile ? `${Math.round(this.selectedFile.size / 1024)}KB` : 'No file'
    });
    
    this.stationService.submitStation(formData).subscribe(
      (response: any) => {
        console.log('Station submission successful:', response);
        this.successMessage = "Charging station registered successfully!";
        this.stationForm.reset();
        this.selectedFile = null;
        this.filePreview = null;
        this.isSubmitting = false;
        
        // Restore email after reset
        this.stationForm.patchValue({
          email: this.userEmail
        });
        
        // Animation before redirect
        const container = document.querySelector('.station-host-container');
        if (container) {
          container.classList.add('redirecting');
        }
        
        // Redirect after delay
        setTimeout(() => {
          this.router.navigate(['/host-panel']);
        }, 3000);
      },
      (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        console.error('Station submission failed:', error);
        
        let errorMessage = "Submission failed: ";
        
        if (error.status === 500) {
          errorMessage += "Server error. Please try again or contact support.";
        } else if (error.error && typeof error.error === 'string') {
          errorMessage += error.error;
        } else if (error.message) {
          errorMessage += error.message;
        } else {
          errorMessage += "Unknown error occurred";
        }
        
        this.showToast(errorMessage, "error");
      }
    );
  }
}