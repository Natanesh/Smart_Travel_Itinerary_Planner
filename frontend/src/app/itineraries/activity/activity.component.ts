import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IndexComponent } from '../../index/index.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css'],
})
export class ActivityComponent implements OnInit {
  activityForm!: FormGroup;
  itinerary: any;
  daysCount = 0;
  http = inject(HttpClient);
  index = inject(IndexComponent);
  auth = inject(AuthService);
  user_id = undefined;
  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.index.currentUser().subscribe((res: any) => {
      if (res.id == undefined) {
        this.auth.logout();
        this.router.navigate(['/login']);
      } else {
        this.user_id = res.id;
        this.auth.login();
        this.itinerary = history.state.itinerary;

        if (!this.itinerary) {
          this.router.navigate(['/create-itinerary']);
          return;
        }

        this.daysCount = this.calculateDays(
          this.itinerary.start_date,
          this.itinerary.end_date
        );

        this.buildForm();
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

  calculateDays(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);

    return (
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1
    );
  }

  buildForm(): void {
    this.activityForm = this.fb.group({
      activities: this.fb.array([]),
    });

    for (let i = 1; i <= this.daysCount; i++) {
      this.activities.push(this.createActivityGroup());
    }
  }

  createActivityGroup(): FormGroup {
    return this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      travelDuration: ['', Validators.required],
    });
  }

  get activities(): FormArray {
    return this.activityForm.get('activities') as FormArray;
  }

  buildActivitiesJson() {
    return {
      days: this.activityForm.value.activities.map(
        (item: any, index: number) => ({
          day: index + 1,
          activities: [item.from, item.to],
          visit_time: `${this.formatTimeToAmPm(
            item.startTime
          )} - ${this.formatTimeToAmPm(item.endTime)}`,
          travel_duration: item.travelDuration,
        })
      ),
    };
  }

  submitActivities(): void {
    if (this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();
      alert('Please fill all activity details');
      return;
    }

    const payload = {
      user_id: this.user_id, // replace with logged-in user id
      destination: this.itinerary.destination,
      start_date: this.itinerary.start_date,
      end_date: this.itinerary.end_date,
      budget: this.itinerary.budget,
      activities: this.buildActivitiesJson(),
      notes: null,
      media_paths: null,
    };

    this.http
      .post('http://localhost:3000/create', payload, {
        withCredentials: true,
      })
      .subscribe((res: any) => {
        alert('Itinerary saved successfully');
        this.router.navigate(['/itineraries']);
      });
  }
}
