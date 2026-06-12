import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    imports:[RouterModule,RouterOutlet,CommonModule],
    
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'EV_ChargingStation';
}
