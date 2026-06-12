

  export class Booking {
    id: string = '';
    userEmail?:string;
    userName: string = '';
    hostEmail: string = '';
    stationId: string = '';
    stationName: string = '';
    bookingDate?: Date;
    status: string = '';
    chargingStartTime?: Date;
    chargingEndTime?: Date;
    amount?: number;
    transactionId?: string;
    startTime?: Date;
    endTime?: Date;
  }