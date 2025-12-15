import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-itinerary-list',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './itinerary-list.component.html'
})
export class ItineraryListComponent {

  itineraries = [
    {
      destination: 'Goa',
      days: 5,
      budget: 30000
    },
    {
      destination: 'Manali',
      days: 7,
      budget: 45000
    }
  ];
}
