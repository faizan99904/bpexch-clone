import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private walletBalance = new BehaviorSubject<number | null>(null);
  private exposure = new BehaviorSubject<number | null>(null);

  walletBalance$ = this.walletBalance.asObservable();
  exposure$ = this.exposure.asObservable();

  setWalletBalance(balance: number | null) {
    this.walletBalance.next(balance);
  }

  setExposure(exposure: number | null) {
    this.exposure.next(exposure);
  }

}
