import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { WhyVoltwayComponent } from '../why-voltway/why-voltway.component';
import { RouterModule } from '@angular/router';
@Component({
    selector: 'app-home',
    imports: [FooterComponent, HeaderComponent, WhyVoltwayComponent,RouterModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {

  logRoute(route: string) {
    console.log('Navigating to:', route);
}

  scrollToSection() {
      const section = document.getElementById('section-2');
      if (section){
        section.scrollIntoView({behavior: 'smooth' });
      }
}
}