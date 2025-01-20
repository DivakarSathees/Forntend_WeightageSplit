import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private data: any[] = [];
  private isDataInitialized: boolean = false;


  constructor() { }

  setData(data: any[]): void {
    if (!this.isDataInitialized) {
      this.data = data;
      this.isDataInitialized = true;
    }
  }

  getData(): any[] {
    return this.data;
  }

  isInitialized(): boolean {
    return this.isDataInitialized;
  }
}
