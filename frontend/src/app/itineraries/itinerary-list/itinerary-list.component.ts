import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { IndexComponent } from '../../index/index.component';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Itinerary } from './itinerary-model';

@Component({
  selector: 'app-itinerary-list',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './itinerary-list.component.html',
  styleUrl: './itinerary-list.component.css',
})
export class ItineraryListComponent implements OnInit {
  ngOnInit(): void {
    this.index.currentUser().subscribe((res: any) => {
      if (res.id == undefined) {
        this.auth.logout();
        this.router.navigate(['/login']);
      } else {
        this.user_id = res.id;
        this.auth.login();
        this.listItineraries();
      }
    });
  }
  auth = inject(AuthService);
  index = inject(IndexComponent);
  router = inject(Router);
  http = inject(HttpClient);
  itineraries: Itinerary[] = [];
  user_id: any = undefined;
  listItineraries() {
    this.http
      .get<Itinerary[]>('http://localhost:3000/itineraries', {
        withCredentials: true,
      })
      .subscribe((res: any) => {
        this.itineraries = res;
        for (let i = 0; i < this.itineraries.length; i++) {
          let start = this.itineraries[i].start_date.split('T')[0].split('-');
          let end = this.itineraries[i].end_date.split('T')[0].split('-');
          this.itineraries[i].start_date =
            start[2] + '-' + start[1] + '-' + start[0];
          this.itineraries[i].end_date = end[2] + '-' + end[1] + '-' + end[0];
        }
      });
  }

  deleteItinerary(id: number) {
    if (confirm('Are you sure you want to delete this itinerary?')) {
      this.http
        .delete(`http://localhost:3000/itineraries/${id}`, {
          withCredentials: true,
        })
        .subscribe({
          next: () => {
            // Remove the deleted itinerary from the local array
            this.itineraries = this.itineraries.filter(
              (item) => item.id !== id
            );
            alert('Itinerary deleted successfully');
          },
          error: (err) => {
            console.error('Error deleting itinerary:', err);
            alert('Failed to delete itinerary. Please try again.');
          },
        });
    }
  }
}
