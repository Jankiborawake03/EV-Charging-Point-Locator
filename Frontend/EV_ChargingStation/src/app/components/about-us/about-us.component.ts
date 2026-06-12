import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-us',
  standalone: true, 
  imports: [HeaderComponent, CommonModule],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0, transform: 'translateY(30px)' })),
      transition(':enter', [
        animate('0.8s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      state('void', style({ opacity: 0, transform: 'translateX(-50px)' })),
      transition(':enter', [
        animate('0.8s 0.3s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class AboutUsComponent {
  foundersList = [
  
    {
      name: 'Chirag Patel',
      position: 'Co-Founder & CTO',
      bio: 'Chirag brings technical expertise and innovation to the platform, ensuring seamless connections between EV users and charging station hosts. His vision for a user-friendly interface has made sustainable energy more accessible to communities everywhere.',
      image: 'assets/images/founder-chirag.jpg'
    }
  ];

  milestones = [
    {
      year: '2023',
      title: 'The Genesis',
      description: 'The idea was born when Kala and Chirag, both EV enthusiasts, realized the potential of community-powered charging solutions.'
    },
    {
      year: '2024',
      title: 'Platform Launch',
      description: 'Our platform officially launched, connecting the first 100 home charging stations with local EV users.'
    },
    {
      year: '2025',
      title: 'Nationwide Expansion',
      description: 'Growing our network across the country, empowering homeowners and providing reliable charging solutions.'
    }
  ];

  stats = [
    { value: '5000+', label: 'Registered Charging Points' },
    { value: '15000+', label: 'Active Users' },
    { value: '50+', label: 'Cities Covered' },
    { value: '₹10M+', label: 'Earned by Hosts' }
  ];

  constructor() { }


}