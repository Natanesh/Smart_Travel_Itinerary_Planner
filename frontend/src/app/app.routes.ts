import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { IndexComponent } from './index/index.component';
import { inject } from '@angular/core';
import { ItineraryListComponent } from './itineraries/itinerary-list/itinerary-list.component';
export const routes: Routes = [
  { path: '', component: IndexComponent },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'home', component: ItineraryListComponent },
];
