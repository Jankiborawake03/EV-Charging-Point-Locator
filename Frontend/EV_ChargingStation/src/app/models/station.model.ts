export interface Station {
    // id?: string;
    name: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
    latitude: number;
    longitude: number;
    ownerEmail: string;
    status?: string; 
    imageUrls?: string[]; 
  }
  