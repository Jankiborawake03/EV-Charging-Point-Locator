export interface ChargingStation {
    id: string;
    stationName: string;
    address: string;
    latitude: number;
    longitude: number;
    email: string; // Owner's email
    active: boolean;
    chargerType: string;
    ports: number;
    fee?: number;
    photoUrl?: string;
    distance?: number;
  }