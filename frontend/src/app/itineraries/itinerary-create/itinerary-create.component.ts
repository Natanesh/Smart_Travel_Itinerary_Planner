import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IndexComponent } from '../../index/index.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-itinerary-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './itinerary-create.component.html',
  styleUrls: ['./itinerary-create.component.css'],
})
export class CreateItineraryComponent implements OnInit {
  itinerary = {
    title: '',
    destination: '',
    start_date: '',
    end_date: '',
    budget: 0,
  };

  index = inject(IndexComponent);
  auth = inject(AuthService);
  router = inject(Router);
  isLoggedIn = false;
  user_id = undefined;

  ngOnInit(): void {
    this.index.currentUser().subscribe((res: any) => {
      if (res.id == undefined) {
        this.auth.logout();
        this.router.navigate(['/login']);
      } else {
        this.user_id = res.id;
        this.auth.login();
      }
    });
  }

  formatTimeToAmPm(time: string): string {
    if (!time) return '';

    const [h, m] = time.split(':');
    let hour = Number(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';

    hour = hour % 12 || 12;

    return `${hour}:${m} ${ampm}`;
  }
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
      alert('End date cannot be earlier than start date.');
      return;
    }

    if (isNaN(Number(this.itinerary.budget))) {
      alert('Budget must be a valid number.');
      return;
    }

    this.router.navigate(['/activities'], {
      state: {
        itinerary: this.itinerary,
        user_id: this.user_id,
      },
    });
  }
}
