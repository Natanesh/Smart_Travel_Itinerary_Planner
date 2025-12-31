import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { IndexComponent } from './index/index.component';
import { ItineraryListComponent } from './itineraries/itinerary-list/itinerary-list.component';
import { DetailsComponent } from './details/details.component';
import { EditDetailsComponent } from './edit-details/edit-details.component';
import { ActivityComponent } from './itineraries/activity/activity.component';
import { CreateItineraryComponent } from './itineraries/itinerary-create/itinerary-create.component';
export const routes: Routes = [
  { path: '', component: IndexComponent },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'itineraries', component: ItineraryListComponent },
  { path: 'itineraries/:id', component: DetailsComponent },
  { path: 'itineraries-create', component: CreateItineraryComponent },
  {
    path: 'activities',
    component: ActivityComponent,
  },
  { path: 'edit', component: EditDetailsComponent },
];
