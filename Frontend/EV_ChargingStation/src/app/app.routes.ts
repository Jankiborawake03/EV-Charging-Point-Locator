import { Routes } from '@angular/router';
import { FindChargingStationComponent } from './components/find-charging-station/find-charging-station.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { HomeComponent } from './components/home/home.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { SignupComponent } from './components/signup/signup.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { StationHostComponent } from './components/station-host/station-host.component';
import { AdminPanelComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EvNewsComponent } from './components/ev-news/ev-news.component';
import { HostPanelComponent } from './components/host-panel/host-panel.component';
import { AdminSignupComponent } from './components/admin-sign-up/admin-sign-up.component';
import { AdminSignInComponent } from './components/admin-sign-in/admin-sign-in.component';
import { HostNotificationsComponent } from './components/host-notification/host-notifications.component';
export const routes: Routes = [

  { path: '', component: HomeComponent },
  { path: 'find-charging-station', component: FindChargingStationComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'sign-in', component: SignInComponent },
  { path:'contact-us',component:ContactUsComponent},
  {path:'signup',component:SignupComponent},
   {path:'forgot-password',component:ForgotPasswordComponent},
   {path:'station-host',component:StationHostComponent},
  {path:'admin-panel',component:AdminPanelComponent},
{path:'profile-page',component:ProfileComponent},
{path:'ev-news',component:EvNewsComponent},
 {path:'host-panel',component:HostPanelComponent},
 
   {path:'admin-sign-up',component:AdminSignupComponent},
   {path:'admin-sign-in',component:AdminSignInComponent},
   {path:'host-notifications',component:HostNotificationsComponent},

];