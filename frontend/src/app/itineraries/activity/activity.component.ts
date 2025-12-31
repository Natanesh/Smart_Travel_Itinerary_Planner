import { Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css'],
})
export class ActivityComponent implements OnInit {
  activityForm!: FormGroup;
  daysCount = 0;
  itinerary: any;
  alertShown = false;
  http = inject(HttpClient);
  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    // 🔹 Get itinerary from navigation state
    this.itinerary = history.state.itinerary;

    if (!this.itinerary) {
      this.router.navigate(['/create-itinerary']);
      return;
    }

    // 🔹 Calculate number of days
    this.daysCount = this.calculateDays(
      this.itinerary.start_date,
      this.itinerary.end_date
    );

    // 🔹 Build form dynamically
    this.buildForm();
  }

  // 🔹 Calculate days between dates
  calculateDays(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);

    return (
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1
    );
  }

  // 🔹 Build dynamic form based on days
  buildForm(): void {
    this.activityForm = this.fb.group({
      activities: this.fb.array([]),
    });

    for (let i = 1; i <= this.daysCount; i++) {
      this.activities.push(this.createActivityGroup(i));
    }
  }

  // 🔹 Activity form group
  createActivityGroup(day: number): FormGroup {
    return this.fb.group({
      day: [`Day ${day}`],
      from: ['', Validators.required],
      to: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      travelDuration: ['', Validators.required],
    });
  }

  // 🔹 Getter for FormArray
  get activities(): FormArray {
    return this.activityForm.get('activities') as FormArray;
  }

  // 🔹 Submit activities
  submitActivities(): void {
    if (this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();

      if (!this.alertShown) {
        alert('⚠️ Please fill all activity details for each day.');
        this.alertShown = true;
      }
      return;
    }
    this.http
      .post(
        'http://localhost:3000/create',
        {
          itinerary: this.itinerary,
          activities: this.activityForm.value.activities,
        },
        {
          withCredentials: true,
        }
      )
      .subscribe();
    console.log('Activities Data:', this.activityForm.value);

    alert('✅ Activities added successfully');
    this.router.navigate(['/itineraries']);
  }

  // 🔹 Validation helper
  hasError(controlName: string, index: number): boolean {
    const control = this.activities.at(index).get(controlName);
    return !!(control && control.invalid && control.touched);
  }
}
