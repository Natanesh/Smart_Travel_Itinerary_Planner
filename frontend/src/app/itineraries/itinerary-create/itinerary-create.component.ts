import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-itinerary-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './itinerary-create.component.html',
  styleUrls: ['./itinerary-create.component.css'],
})
export class CreateItineraryComponent {
  itinerary = {
    title: '',
    destination: '',
    start_date: '',
    end_date: '',
    budget: 0,
  };

  constructor(private router: Router) {}

  goToActivities() {
    if (
      !this.itinerary.destination.trim() ||
      !this.itinerary.start_date ||
      !this.itinerary.end_date ||
      !this.itinerary.budget
    ) {
      alert('Please fill all the fields before continuing.');
      return;
    }

    const startDate = new Date(this.itinerary.start_date);
    const endDate = new Date(this.itinerary.end_date);

    if (endDate < startDate) {
      alert('⚠️ End date cannot be earlier than start date.');
      return;
    }

    if (isNaN(Number(this.itinerary.budget))) {
      alert('⚠️ Budget must be a valid number.');
      return;
    }

    this.router.navigate(['/activities'], {
      state: { itinerary: this.itinerary },
    });
  }
}
