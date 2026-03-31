import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NgxLoadingService {
  // Initialize with `false`, so it will never return `null`
  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // Expose the observable that emits only `boolean` values
  public loading$ = this.loadingSubject.asObservable();

  // Show the loader
  show() {
    this.loadingSubject.next(true);
  }

  // Hide the loader
  hide() {
    this.loadingSubject.next(false);
  }
}
