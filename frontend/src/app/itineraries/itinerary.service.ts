import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ItineraryService {
  private API = 'http://localhost:3000/itineraries';

  constructor(private http: HttpClient) {}

  createItinerary(data: any) {
    return this.http.post(this.API, data, { withCredentials: true });
  }

  getItineraries() {
    return this.http.get(this.API, { withCredentials: true });
  }
}
