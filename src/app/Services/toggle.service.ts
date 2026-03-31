import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToggleService {
  private sidebarState = new BehaviorSubject<boolean>(true);
  private OTPAuthentication:BehaviorSubject<boolean> =  new BehaviorSubject<boolean>(false);
  private slimSidebarSubject = new BehaviorSubject<boolean>(false);
  private BetLockModal :BehaviorSubject<boolean> =  new BehaviorSubject<boolean>(false);
  slimSidebar$ = this.slimSidebarSubject.asObservable();

  toggleSlimSidebar() {
    const currentState = this.slimSidebarSubject.value;
    this.slimSidebarSubject.next(!currentState);
  }


  // Sidebar
  getSidebarState(){
    return this.sidebarState;
  }
  setSidebarState(val:boolean){
    this.sidebarState.next(val)
  }




  constructor() { }
}
