import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionDataService {
  incrDataPoint: number = 0;
  decrDataPoint: number = 0;
  constructor() { }

  getIncr() {
    return this.incrDataPoint;
  }

  getDecr() {
    return this.decrDataPoint;
  }

  setIncr(data) {
    this.incrDataPoint = data;
  }

  setDecr(data) {
    this.decrDataPoint = data;
  }


}
