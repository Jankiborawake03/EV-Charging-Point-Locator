import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { ChargingStationService } from '../../services/charging-station.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-find-charging-station',
  imports: [CommonModule, FormsModule],
  templateUrl: './find-charging-station.component.html',
  styleUrls: ['./find-charging-station.component.scss'],
  standalone: true
})
export class FindChargingStationComponent implements OnInit {
  bookingStatus: 'pending' | 'approved' | 'timeout' | null = null;
  hostCountdown: number = 600; 
  countdownInterval: any;
  selectedRadius = 5;
  radiusOptions = [1, 2, 5, 10, 20];
  chargingStations: any[] = [];
  displayedStations: any[] = [];
  maxVisibleStations = 10;
  selectedStation: any = null;
  showPayment = false;
  showPendingMessage = false; 
  requestSent = false; 
  showMore = false;
  map: L.Map | null = null;
  userLocation: {lat: number, lng: number} | null = null;
  markers: L.Marker[] = []; 
  userMarker: L.Marker | null = null;
  isLoading = false;
  showModalBackdrop = false;
  locationError = false;
  locationErrorMessage = '';
  isAuthenticated = false;
  isMapInitialized = false;
  hostResponseMessage: string = '';
  notificationCheckInterval: any;
  notificationId: string = '';
  
  private userIcon!: L.Icon;
  private stationIcon!: L.Icon;
  private selectedStationIcon!: L.Icon;
  private defaultIcon!: L.Icon;


  
  isshowPendingMessage: boolean = false;

  constructor(
    private stationService: ChargingStationService,
    private router: Router
  ) {
    this.checkAuthentication();
  }

  checkAuthentication() {
    const email = localStorage.getItem('email');
    this.isAuthenticated = !!email;
  }
  
  private initIcons(): void {
    try {
     
      const iconRetinaUrl = '/assets/marker-icon-2x.png';
      const iconUrl = '/assets/marker-icon.png';
      const shadowUrl = '/assets/marker-shadow.png';
      
      this.defaultIcon = L.icon({
        iconRetinaUrl,
        iconUrl,
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
      });
      
      
      try {
        this.userIcon = L.icon({
          iconUrl: '/assets/Map_marker.svg',
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30]
        });
      } catch (error) {
        console.error("Error initializing user icon:", error);
        this.userIcon = this.defaultIcon;
      }

      try {
        this.stationIcon = L.icon({
          iconUrl: '/assets/location.png',
          iconSize: [50, 60],
          iconAnchor: [15, 40],
          popupAnchor: [0, -40]
        });
      } catch (error) {
        console.error("Error initializing station icon:", error);
        this.stationIcon = this.defaultIcon;
      }

      try {
        this.selectedStationIcon = L.icon({
          iconUrl: '/assets/station.png',
          iconSize: [50, 60], 
          iconAnchor: [17, 45],
          popupAnchor: [0, -45]
        });
      } catch (error) {
        console.error("Error initializing selected station icon:", error);
        this.selectedStationIcon = this.defaultIcon;
      }
      
      console.log("Icons initialized successfully");
    } catch (error) {
      console.error("Error in icon initialization:", error);
      this.useDefaultIcons();
    }
  }
  
  startCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  
    this.countdownInterval = setInterval(() => {
      this.hostCountdown--;
  
      if (this.hostCountdown <= 0) {
        clearInterval(this.countdownInterval);
        this.handleHostTimeout();
      }
    }, 1000);
  }
  
  handleHostTimeout() {
   
    if (this.notificationCheckInterval) {
      clearInterval(this.notificationCheckInterval);
    }
  
    this.showPendingMessage = false;
    this.requestSent = false;
    this.showModalBackdrop = false;
  
    this.removePendingRequest(this.selectedStation.id);
  
    alert('The host did not respond in time. Your booking request has timed out.');
  }

  private useDefaultIcons(): void {
    console.log("Using default icons due to error");
    const iconRetinaUrl = '/assets/marker-icon-2x.png';
    const iconUrl = '/assets/marker-icon.png';
    const shadowUrl = '/assets/marker-shadow.png';
    
    const defaultIcon = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    
    this.userIcon = defaultIcon;
    this.stationIcon = defaultIcon;
    this.selectedStationIcon = defaultIcon;
  }

  ngOnInit() {
    try {
      
      const iconRetinaUrl = '/assets/marker-icon-2x.png';
      const iconUrl = '/assets/marker-icon.png';
      const shadowUrl = '/assets/marker-shadow.png';
      const iconDefault = L.icon({
        iconRetinaUrl,
        iconUrl,
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
      });
      
      L.Marker.prototype.options.icon = iconDefault;
      
      this.initIcons();
      this.initMap();
      
      
      setTimeout(() => {
        this.getUserLocation();
      }, 500);
    } catch (error) {
      console.error("Error during initialization:", error);
    }
  }

  expandList() {
    this.showMore = true;
    this.displayedStations = this.chargingStations;
  }

  cancelSelection() {
    this.selectedStation = null;
    this.showModalBackdrop = false;
    this.showPendingMessage = false;
    this.requestSent = false;
    
   
    if (this.notificationCheckInterval) {
      clearInterval(this.notificationCheckInterval);
    }
  }

  onStationSelect(station: any) {
    if (!station) return;
    
    
    if (!station.active) {
      alert('This charging station is currently not available for booking.');
      return;
    }
    
    this.selectedStation = station;
    this.showModalBackdrop = true;
    
    if (this.map && station.latitude && station.longitude) {
      this.map.setView([station.latitude, station.longitude], 15);
      this.highlightSelectedStation(station);
    }
  }

  highlightSelectedStation(station: any) {
    this.clearMarkers();
    
    this.chargingStations.forEach((s) => {
     
      if (s.latitude !== undefined && s.longitude !== undefined && 
          !isNaN(parseFloat(s.latitude)) && !isNaN(parseFloat(s.longitude)) && 
          this.map) {
        
        
        if (!s.active) {
          return;
        }
        
        const isSelected = s.id === station.id;
        const icon = isSelected ? this.selectedStationIcon : this.stationIcon;
        
        try {
          
          const lat = typeof s.latitude === 'string' ? parseFloat(s.latitude) : s.latitude;
          const lng = typeof s.longitude === 'string' ? parseFloat(s.longitude) : s.longitude;
          
          const marker = L.marker([lat, lng], { icon }).addTo(this.map);
          
          if (isSelected) {
            marker.bindPopup(`<b>${s.stationName || 'Selected Station'}</b><br>${s.address || 'No address'}<br>${s.distance.toFixed(2)} KM`).openPopup();
          } else {
            marker.bindTooltip(s.stationName || 'Charging Station');
            marker.on('click', () => this.onStationSelect(s));
          }
          
          this.markers.push(marker);
        } catch (error) {
          console.error(`Error adding marker for station ${s.id}:`, error);
          
          try {
            if (this.map) {
              const marker = L.marker([parseFloat(s.latitude), parseFloat(s.longitude)]).addTo(this.map);
              marker.on('click', () => this.onStationSelect(s));
              this.markers.push(marker);
            }
          } catch (fallbackError) {
            console.error('Fallback marker also failed:', fallbackError);
          }
        }
      } else {
        console.warn(`Station ${s.id} has invalid coordinates:`, s.latitude, s.longitude);
      }
    });
    
    this.addUserMarker();
  }

  confirmBooking() {
    if (!this.selectedStation) {
      alert('Please select a station first.');
      return;
    }

    if (!this.isAuthenticated) {
      alert('Please sign in to book a charging station.');
      this.router.navigate(['/sign-in']);
      return;
    }
    
    
    this.stationService.findStationById(this.selectedStation.id).subscribe({
      next: (station) => {
        if (!station.active) {
          alert('This charging station is no longer available. It may have been deactivated by the host.');
          this.cancelSelection();
          this.findStations(); 
          return;
        }
        
       
        if (this.requestSent) {
          alert('You have already sent a booking request for this station. Please wait for the host to approve.');
          return;
        }
        
        this.isLoading = true;
        console.log('Selected station for booking:', this.selectedStation);
        
        this.stationService.notifyHost(this.selectedStation.id).subscribe({
          next: (response) => {
            console.log('Host notification response:', response);
            this.isLoading = false;
            
            if (response && response.notificationId) {
              this.notificationId = response.notificationId;
              console.log('Host notification ID:', this.notificationId);
           
            }
            
            this.showPendingMessage = true;
            this.requestSent = true;
            
            
            this.savePendingRequest(this.selectedStation.id);

            this.startNotificationStatusCheck();

            this.startCountdown();

          },
          error: (error) => {
            this.isLoading = false;
            console.error('Error notifying host:', error);
            
            let errorMessage = 'Failed to notify the station host. Please try again later.';
            
            if (error.error) {
              console.error('Server error response:', error.error);
              
              if (typeof error.error === 'object' && error.error.error) {
                errorMessage = error.error.error;
              }
            }
            
            if (error.status === 400) {
              if (error.error && error.error.error) {
                errorMessage = error.error.error;
              }
            } else if (error.status === 401) {
              errorMessage = 'Your session has expired. Please sign in again.';
              this.router.navigate(['/sign-in']);
            } else if (error.status === 404) {
              errorMessage = 'The server endpoint was not found. Please contact support.';
            }
            
            alert(errorMessage);
          }
        });
      },
      error: (error) => {
        console.error('Error checking station status:', error);
        alert('Could not verify station availability. Please try again.');
      }
    });
  }

  startNotificationStatusCheck() {
    // Clear any existing interval
    if (this.notificationCheckInterval) {
      clearInterval(this.notificationCheckInterval);
    }
    
    // Check every 5 seconds
    this.notificationCheckInterval = setInterval(() => {
      console.log('inside check every 5 sec...');
    
      this.checkNotificationStatus();
    }, 5000);
  }
  
  // Add this method to check notification status
  checkNotificationStatus() {
    console.log('inside check...');
    console.log('inside check notificationId...',this.notificationId);
    console.log('inside check showPendingMessage...',this.showPendingMessage);
        
    // If we don't have a notification ID or no longer showing pending message, stop checking
    if (!this.notificationId || !this.showPendingMessage) {
      if (this.notificationCheckInterval) {
        console.log('clear interval check...');
    
        clearInterval(this.notificationCheckInterval);
      }
      return;
    }
  
    
    this.stationService.checkNotificationStatus(this.notificationId).subscribe({
      
      next: (response) => {
        console.log('Notification status check:', response);
        
        if (response && response.status) {
          const status = response.status.toUpperCase();
          console.log('status:', status);
          
          if (status === 'APPROVED') {
           
            if (this.notificationCheckInterval) {
              clearInterval(this.notificationCheckInterval);
            }
            
          
            this.hostResponseMessage = response.responseMessage || 'Your request has been approved by the host.';
            
            
            this.showPendingMessage = false;
            this.showPayment = true;
          } 
          else if (status === 'REJECTED') {
            
            if (this.notificationCheckInterval) {
              clearInterval(this.notificationCheckInterval);
            }
            
            this.showPendingMessage = false;
            this.requestSent = false;
            this.showModalBackdrop = false;
            
          
            const rejectMessage = response.responseMessage || 'Your request has been rejected by the host.';
            alert(rejectMessage);
            
            
            this.removePendingRequest(this.selectedStation.id);
          }
        }
      },
      error: (error) => {
        console.error('Error checking notification status:', error);
      }
    });
  }

 
  savePendingRequest(stationId: string) {
    const email = localStorage.getItem('email');
    if (!email) return;
    
  
    const pendingRequestsStr = localStorage.getItem('pendingRequests');
    let pendingRequests = pendingRequestsStr ? JSON.parse(pendingRequestsStr) : [];
    
   
    if (!pendingRequests.some((req: any) => req.stationId === stationId)) {
      pendingRequests.push({
        stationId: stationId,
        requestTime: new Date().toISOString(),
        stationName: this.selectedStation.stationName || 'Charging Station'
      });
      
      localStorage.setItem('pendingRequests', JSON.stringify(pendingRequests));
    }
  }


  processPayment() {
    if (!this.selectedStation) {
      alert('No station selected for payment.');
      return;
    }
    this.isLoading = true;
    this.stationService.processPayment(this.selectedStation.id).subscribe({
      next: () => {
        this.isLoading = false;
        this.showPayment = false;
        this.showModalBackdrop = false;
        this.showPendingMessage = false;
        this.requestSent = false;
        
  
        this.removePendingRequest(this.selectedStation.id);
        
        this.getDirections();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Payment failed:', error);
        alert('Payment failed. Please try again.');
      }
    });
  }


  removePendingRequest(stationId: string) {
    const pendingRequestsStr = localStorage.getItem('pendingRequests');
    if (!pendingRequestsStr) return;
    
    try {
      let pendingRequests = JSON.parse(pendingRequestsStr);
      pendingRequests = pendingRequests.filter((req: any) => req.stationId !== stationId);
      localStorage.setItem('pendingRequests', JSON.stringify(pendingRequests));
    } catch (error) {
      console.error('Error removing pending request:', error);
    }
  }

  getDirections() {
    if (!this.userLocation || !this.selectedStation) {
      alert('User location or station not available for directions.');
      return;
    }
    const directionsUrl = `https://www.google.com/maps/dir/${this.userLocation.lat},${this.userLocation.lng}/${this.selectedStation.latitude},${this.selectedStation.longitude}`;
    window.open(directionsUrl, '_blank');
  }

 
  viewNotifications() {
    this.router.navigate(['/notifications']);
  }

  initMap() {
    if (this.map) {
      console.log('Map already initialized');
      this.isMapInitialized = true;
      return;
    }
    
    try {
      console.log('Initializing map...');
      this.map = L.map('map', {
        zoomControl: true,
        attributionControl: true
      }).setView([20.5937, 78.9629], 5);
      
      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(this.map);
      
      const locationButton = new L.Control({position: 'topleft'});
      
      locationButton.onAdd = (map: L.Map): HTMLElement => {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        const button = L.DomUtil.create('a', '', div);
        button.href = '#';
        button.title = 'Locate Me';
        button.innerHTML = '⊕'; 
        button.style.fontWeight = 'bold';
        button.style.fontSize = '18px';
        button.style.lineHeight = '30px';
        button.style.textAlign = 'center';
        button.style.width = '30px';
        button.style.height = '30px';
        button.style.display = 'block';
        
        L.DomEvent.on(button, 'click', (e) => {
          L.DomEvent.stopPropagation(e);
          L.DomEvent.preventDefault(e);
          this.getUserLocation();
        });
        
        return div;
      };
      
      locationButton.addTo(this.map);
      
      
      this.map.on('load', () => {
        console.log('Map fully loaded');
        this.isMapInitialized = true;
        
        
        if (this.chargingStations.length > 0) {
          this.loadStationsOnMap();
        }
      });
      
     
      setTimeout(() => {
        if (!this.isMapInitialized) {
          console.log('Map load event did not fire, setting initialized manually');
          this.isMapInitialized = true;
          
          if (this.chargingStations.length > 0) {
            this.loadStationsOnMap();
          }
        }
      }, 2000);
      
      console.log('Map initialization complete');
    } catch (err) {
      console.error("Error initializing map:", err);
    }
  }

  handleLocationFound(position: GeolocationPosition | {latlng: {lat: number, lng: number}}) {
    this.locationError = false;
    this.locationErrorMessage = '';
    
    if ('latlng' in position) {
      this.userLocation = {
        lat: position.latlng.lat,
        lng: position.latlng.lng
      };
    } else if ('coords' in position) {
      this.userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    } else {
      return;
    }
    
    console.log('User location found:', this.userLocation);
    
    if (this.map && this.userLocation) {
      this.map.setView([this.userLocation.lat, this.userLocation.lng], 13);
      this.addUserMarker();
      this.findStations();
    } else if (!this.map) {
      console.error('Map not initialized when handling location');
      this.initMap();
      setTimeout(() => {
        if (this.map && this.userLocation) {
          this.map.setView([this.userLocation.lat, this.userLocation.lng], 13);
          this.addUserMarker();
          this.findStations();
        }
      }, 500);
    }
    
    this.isLoading = false;
  }

  handleLocationError(error: GeolocationPositionError | any) {
    this.isLoading = false;
    this.locationError = true;
    
    if ('code' in error) {
      switch(error.code) {
        case 1: 
          this.locationErrorMessage = 'Location access denied. Please enable location services in your browser settings.';
          break;
        case 2:
          this.locationErrorMessage = 'Your current location is unavailable. Please try again later.';
          break;
        case 3: 
          this.locationErrorMessage = 'Location request timed out. Please try again.';
          break;
        default:
          this.locationErrorMessage = 'Failed to get your location. Please enable location services.';
      }
    } else {
      this.locationErrorMessage = 'Failed to get your location. Please enable location services.';
    }
    
    console.error('Geolocation error:', error);
    
    
    if (this.map) {

      this.userLocation = { lat: 20.5937, lng: 78.9629 }; 
      this.addUserMarker();
      this.findStations();
    } else {
      console.error('Map not initialized when handling location error');
      this.initMap();
      setTimeout(() => {
        this.userLocation = { lat: 20.5937, lng: 78.9629 };
        if (this.map) {
          this.addUserMarker();
          this.findStations();
        }
      }, 500);
    }
  }

  getUserLocation() {
    this.isLoading = true;
    
    if (!navigator.geolocation) {
      this.locationError = true;
      this.locationErrorMessage = "Geolocation is not supported by your browser.";
      this.isLoading = false;
      
      
      this.userLocation = { lat: 20.5937, lng: 78.9629 };
      this.addUserMarker();
      this.findStations();
      return;
    }
  
    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTimeout(() => {
            this.isLoading = false;
            this.handleLocationFound(position);
          }, 0);
        },
        (error) => {
          setTimeout(() => {
            this.isLoading = false;
            this.handleLocationError(error);
          }, 0);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } catch (err) {
      console.error("Geolocation error:", err);
      this.isLoading = false;
      this.locationError = true;
      this.locationErrorMessage = "Failed to access location services. Please check your browser settings.";
      
     
      this.userLocation = { lat: 20.5937, lng: 78.9629 };
      this.addUserMarker();
      this.findStations();
    }
  }
  
  addUserMarker() {
    if (!this.map || !this.userLocation) {
      console.error('Cannot add user marker: map or user location not available');
      return;
    }
    
    if (this.userMarker) {
      try {
        this.map.removeLayer(this.userMarker);
      } catch (err) {
        console.warn('Error removing existing user marker:', err);
      }
    }
    
    
    if (this.map) {
      this.map.eachLayer((layer) => {
        if (layer instanceof L.Circle && this.map) {
          try {
            this.map.removeLayer(layer);
          } catch (err) {
            console.warn('Error removing circle layer:', err);
          }
        }
      });
    }
    
    try {
      if (this.map && this.userLocation) {
       
        let markerIcon;
        try {
          markerIcon = this.userIcon;
        } catch (err) {
          console.warn('Using default icon for user marker due to error:', err);
          markerIcon = new L.Icon.Default();
        }
      
        this.userMarker = L.marker(
          [this.userLocation.lat, this.userLocation.lng], 
          { 
            icon: markerIcon,
            zIndexOffset: 1000, 
            draggable: false
          }
        )
        .addTo(this.map)
        .bindPopup('Your Location')
        .openPopup();
        
        
        try {
          L.circle([this.userLocation.lat, this.userLocation.lng], {
            radius: this.selectedRadius * 1000, 
            color: '#3388ff',
            fillColor: '#3388ff',
            fillOpacity: 0.1,
            weight: 1
          }).addTo(this.map);
        } catch (circleErr) {
          console.warn('Error adding radius circle:', circleErr);
        }
        
        console.log('User marker added successfully');
      }
    } catch (err) {
      console.error("Error adding user marker:", err);
    }
  }

  findStations() {
    if (!this.userLocation) {
      alert('User location not found. Please enable location services.');
      return;
    }
    
    this.isLoading = true;
    console.log('Finding stations near:', this.userLocation.lat, this.userLocation.lng, this.selectedRadius);
    
    this.stationService.getNearbyStations(
      this.userLocation.lat, 
      this.userLocation.lng, 
      this.selectedRadius
    ).subscribe({
      next: (stations) => {
        this.isLoading = false;
        console.log('Raw stations data received:', stations);
        console.log('Total stations received:', stations.length);
        console.log('Active stations count:', stations.filter(s => s.active).length);
        
        if (stations.length === 0) {
          console.log('No stations found in the area');
          alert('No charging stations found in the selected radius. Try increasing the search radius.');
        }
        
        if (this.userLocation) {
          this.chargingStations = stations.map(station => {
            
            const stationLat = typeof station.latitude === 'string' ? 
              parseFloat(station.latitude) : station.latitude;
            const stationLng = typeof station.longitude === 'string' ? 
              parseFloat(station.longitude) : station.longitude;
            
            const stationWithDistance = {
              ...station,
              latitude: stationLat,
              longitude: stationLng,
              distance: this.calculateDistance(
                this.userLocation!.lat,
                this.userLocation!.lng,
                stationLat,
                stationLng
              )
            };
            
            
            console.log(`Station ${station.id}: active=${station.active}, coords=[${stationLat}, ${stationLng}]`);
            
            return stationWithDistance;
          }).filter(station => {
            
            const isValid = !isNaN(station.latitude) && !isNaN(station.longitude);
            if (!isValid) {
              console.warn(`Filtered out station ${station.id} with invalid coordinates`);
            }
            return isValid;
          });
          
          console.log('Processed stations after coordinate validation:', this.chargingStations.length);
          
          this.chargingStations.sort((a, b) => a.distance - b.distance);

          
          console.log('Active stations:', this.chargingStations.filter(s => s.active).length);
          console.log('Inactive stations:', this.chargingStations.filter(s => !s.active).length);
          
          
          const activeStations = this.chargingStations.filter(station => station.active);
          console.log('Number of active stations for display:', activeStations.length);
          
          this.displayedStations = activeStations.slice(0, this.maxVisibleStations);
          this.showMore = activeStations.length > this.maxVisibleStations;
          
         
          setTimeout(() => {
            this.loadStationsOnMap();
          }, 300);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching stations:', error);
        alert('Failed to fetch charging stations. Please try again later.');
      }
    });
  }


  loadStationsOnMap() {
    if (!this.map) {
      console.error('Map not initialized - trying to initialize map now');
      this.initMap();
      
      setTimeout(() => this.loadStationsOnMap(), 500);
      return;
    }
    
    console.log('Loading stations on map:', this.chargingStations.length);
    
    this.clearMarkers(); 
    
    if (this.chargingStations.length === 0) {
      console.log('No stations to display on map');
      this.addUserMarker();
      return;
    }
    
    
    const activeStations = this.chargingStations.filter(station => station.active);
    console.log(`Active stations: ${activeStations.length} out of ${this.chargingStations.length}`);
    
    let validMarkers = 0;
    
    this.chargingStations.forEach((station) => {
      
      console.log(`Processing station ${station.id}: active=${station.active}, coords=[${station.latitude}, ${station.longitude}]`);
      
      
      if (station.latitude !== undefined && station.longitude !== undefined) {
        
        const lat = typeof station.latitude === 'string' ? parseFloat(station.latitude) : station.latitude;
        const lng = typeof station.longitude === 'string' ? parseFloat(station.longitude) : station.longitude;
        
        if (!isNaN(lat) && !isNaN(lng) && this.map) {
          try {
            
            if (!station.active) {
              console.log(`Skipping inactive station ${station.id}`);
              return;
            }
            
            console.log(`Adding marker for station ${station.id} at [${lat}, ${lng}]`);
            
            
            let markerIcon;
            try {
              markerIcon = this.stationIcon;
            } catch (err) {
              console.warn('Using default icon due to error:', err);
              markerIcon = new L.Icon.Default();
            }
            
            const marker = L.marker([lat, lng], { 
              icon: markerIcon,
              riseOnHover: true
            }).addTo(this.map);
            
            marker.on('click', () => this.onStationSelect(station));
            marker.bindTooltip(`${station.stationName || 'Charging Station'} (${station.distance?.toFixed(2) || '?'} KM)`);
            this.markers.push(marker);
            validMarkers++;
          } catch (err) {
            console.error(`Error adding marker for station ${station.id}:`, err);
            
            try {
              if (station.active && this.map) {
                const defaultMarker = L.marker([lat, lng]).addTo(this.map);
                defaultMarker.on('click', () => this.onStationSelect(station));
                this.markers.push(defaultMarker);
                validMarkers++;
                console.log('Added fallback marker');
              }
            } catch (fallbackErr) {
              console.error('Fallback marker also failed:', fallbackErr);
            }
          }
        } else {
          console.warn(`Station ${station.id} has invalid coordinates after parsing:`, lat, lng);
        }
      } else {
        console.warn(`Station ${station.id} is missing coordinates:`, station.latitude, station.longitude);
      }
    });
    
    console.log(`Added ${validMarkers} valid markers to the map`);
    
    this.addUserMarker();
    
    
    if (validMarkers > 0 && this.map) {
      try {
        const allMarkers = [...this.markers];
        if (this.userMarker) {
          allMarkers.push(this.userMarker);
        }
        
        if (allMarkers.length > 0) {
          const group = L.featureGroup(allMarkers);
          this.map.fitBounds(group.getBounds().pad(0.2));
        }
      } catch (err) {
        console.error("Error fitting bounds:", err);
        
        if (this.userLocation) {
          this.map.setView([this.userLocation.lat, this.userLocation.lng], 13);
        }
      }
    } else if (this.userLocation && this.map) {
      
      this.map.setView([this.userLocation.lat, this.userLocation.lng], 13);
    }
  }

  clearMarkers() {
    if (!this.map) return;
    
    console.log(`Clearing ${this.markers.length} markers`);
    
    for (const marker of this.markers) {
      try {
        this.map.removeLayer(marker);
      } catch (err) {
        console.error("Error removing marker:", err);
      }
    }
    this.markers = [];
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
      console.warn('Invalid coordinates for distance calculation:', lat1, lon1, lat2, lon2);
      return Infinity;
    }
    
    
    const R = 6371.0710; 
    
    
    const radLat1 = this.deg2rad(lat1);
    const radLon1 = this.deg2rad(lon1);
    const radLat2 = this.deg2rad(lat2);
    const radLon2 = this.deg2rad(lon2);
    
        const dLat = radLat2 - radLat1;
    const dLon = radLon2 - radLon1;
    
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(radLat1) * Math.cos(radLat2) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    const adjustmentFactor = 1.2; 
    
    return R * c * adjustmentFactor;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }


  onRadiusChange() {
    console.log('Radius changed to:', this.selectedRadius);
    if (this.userLocation) {
      this.addUserMarker(); 
      this.findStations(); 
    }
  }
}