export interface Notification {
  id: string;
  recipientId: string;
  senderId: string;
  senderName: string;
  message: string;
  type: string;
  createdAt: string;
  read: boolean;
  email: string;
  status: string; 
  respondedAt?: string;
  responseMessage?: string;
  actionBy?: string;
  senderEmail?: string;
}