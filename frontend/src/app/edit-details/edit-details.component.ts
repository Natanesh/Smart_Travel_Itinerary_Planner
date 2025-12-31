import { Component, inject, Injectable, OnInit } from '@angular/core';
import { ViewDetails } from '../details/details-model';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
@Injectable({ providedIn: 'root' })
@Component({
  selector: 'app-edit-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-details.component.html',
  styleUrl: './edit-details.component.css',
})
export class EditDetailsComponent {
  details: ViewDetails[] = [];
  fb = inject(FormBuilder);
  editData = this.fb.group({
    place: ['', Validators.required],
    st_date: ['', Validators.required],
    end_date: ['', Validators.required],
    budget: ['', Validators.required],
  });

  submit() {
    console.log(this.editData.value);
  }
  updateDetails(data: ViewDetails[]) {
    // this.details = data;
    this.editData.patchValue({
      place: 'hey',
      st_date: '2025-02-10',
      end_date: '2025-03-10',
      budget: '123',
    });
  }
}
