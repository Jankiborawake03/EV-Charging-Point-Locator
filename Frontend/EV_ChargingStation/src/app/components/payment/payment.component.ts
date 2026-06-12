import { Component, OnInit } from '@angular/core';
import { StripePaymentService } from '../../services/StripePaymentService';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from '../../services/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  imports: [CommonModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {
  stripe: Stripe | null = null;
  isProcessing = false;
  paymentItems = [
      { 
          name: 'Basic Plan', 
          price: 10.00, 
          description: 'Monthly subscription with basic features' 
      }
  ];

  constructor(private stripePaymentService: StripePaymentService) {}

  async ngOnInit() {
      this.stripe = await loadStripe(environment.stripePublishableKey);
  }

  async initiateCheckout() {
      if (!this.stripe) {
          console.error('Stripe has not been initialized');
          return;
      }

      this.isProcessing = true;

      try {
          const response = await this.stripePaymentService.createCheckoutSession().toPromise();

          if (response?.sessionId) {
              const result = await this.stripe.redirectToCheckout({
                  sessionId: response.sessionId
              });

              if (result.error) {
                  console.error('Checkout failed:', result.error);
                  alert('Payment process failed: ' + result.error.message);
              }
          } else if (response?.error) {
              console.error('Backend error:', response.error);
              alert('Payment error: ' + response.error);
          }
      } catch (error) {
          console.error('Checkout process error:', error);
          alert('There was an error processing your payment. Please try again.');
      } finally {
          this.isProcessing = false;
      }
  }
}