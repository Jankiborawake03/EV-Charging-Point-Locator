import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
    selector: 'app-footer',
    imports: [RouterModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss'
})
export class FooterComponent {
    email = 'VoltWay@yahoo.in';

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
}
