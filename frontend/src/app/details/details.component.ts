import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { IndexComponent } from '../index/index.component';
import { ViewDetails } from './details-model';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { EditDetailsComponent } from '../edit-details/edit-details.component';
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  router = inject(Router);
  user_id: any = undefined;
  itinerary_id: any = undefined;
  current_user_id = undefined;
  auth = inject(AuthService);
  index = inject(IndexComponent);
  http = inject(HttpClient);
  edit = inject(EditDetailsComponent);
  details: ViewDetails[] = [];
  ngOnInit(): void {
    let urlData = this.router.url.split('itineraries/')[1];
    this.user_id = urlData.split('_')[1];
    this.itinerary_id = urlData.split('_')[2];
    this.index.currentUser().subscribe((res: any) => {
      if (res.id == undefined) {
        this.auth.logout();
        this.router.navigate(['/login']);
      } else {
        this.current_user_id = res.id;
        this.auth.login();
        this.displayItineraryDetails();
      }
    });
  }
  displayItineraryDetails() {
    this.http
      .get<any>(
        `http://localhost:3000/itineraries/${this.user_id}/${this.itinerary_id}`,
        {
          withCredentials: true,
        }
      )
      .subscribe((res) => {
        console.log(res);
        this.details = res;
        let start = this.details[0].start_date.split('T')[0].split('-');
        let end = this.details[0].end_date.split('T')[0].split('-');
        this.details[0].start_date = start[2] + '-' + start[1] + '-' + start[0];
        this.details[0].end_date = end[2] + '-' + end[1] + '-' + end[0];
        let created_date = this.details[0].created_at.split('T')[0].split('-');
        this.details[0].created_at =
          created_date[2] + '-' + created_date[1] + '-' + created_date[0];
      });
  }

  deleteItinerary() {
    if (
      confirm(
        'Are you sure you want to delete this itinerary? This action cannot be undone.'
      )
    ) {
      this.http
        .delete(`http://localhost:3000/itineraries/${this.itinerary_id}`, {
          withCredentials: true,
        })
        .subscribe({
          next: () => {
            alert('Itinerary deleted successfully');
            // Navigate back to itinerary list after deletion
            this.router.navigate(['/itineraries']);
          },
          error: (err) => {
            console.error('Error deleting itinerary:', err);
            alert('Failed to delete itinerary. Please try again.');
          },
        });
    }
  }
  editItinerary() {
    this.edit.updateDetails(this.details);
    this.router.navigate(['/edit']);
  }
}
