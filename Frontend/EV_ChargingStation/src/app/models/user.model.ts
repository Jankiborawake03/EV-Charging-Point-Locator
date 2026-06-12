import { Booking } from './booking.model';
// import { Transaction } from './transaction.model';
// import { Review } from './review.model';

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  contactNumber?: string;
  email: string;
  password?: string;
  role?: string; // "EV Owner" or "Station Host"
  otp?: string;
  otpExpiry?: Date;
  
  // Profile photo as base64 string
  profilePhoto?: string;
  
  // Station host specific fields
  stationName?: string;
  address?: string;
  ports?: number;
  chargerType?: string;
  
  // History collections
  bookings?: Booking[];
//   payments?: Transaction[];
//   reviews?: Review[];
}