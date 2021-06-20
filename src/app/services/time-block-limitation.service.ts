import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeBlockLimitationService {

  timeBlockLimitation: number;

  constructor() {
    this.timeBlockLimitation = 5;
  }

  setLimitation(time: number) {
    this.timeBlockLimitation = time;
  }

  getLimitation() {
    return this.timeBlockLimitation;
  }
}
