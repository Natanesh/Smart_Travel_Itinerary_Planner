import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Itinerary } from '../itinerary-list/itinerary-model';

@Component({
  selector: 'app-create-itinerary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './itinerary-create.component.html',
  styleUrl: './itinerary-create.component.css',
})
export class CreateItineraryComponent {

  http = inject(HttpClient);
  router = inject(Router);

  itinerary: Partial<Itinerary> = {
    destination: '',
    start_date: '',
    end_date: '',
    budget: 0
  };

  
  createItinerary() {
    this.http.post(
      'http://localhost:3000/itineraries',
      this.itinerary,
      { withCredentials: true }
    ).subscribe({
      next: () => {
        alert('Itinerary created successfully');

        
        this.goToActivities();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to create itinerary');
      }
    });
  }

  
  goToActivities() {
    this.router.navigate(['/activities'], {
      state: {
        itinerary: this.itinerary
      }
    });
  }
}
