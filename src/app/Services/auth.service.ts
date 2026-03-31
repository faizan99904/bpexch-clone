import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {BackendService} from "./backend.service";
import {WalletService} from "./wallet.service";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggingOut = false;
  constructor(private router: Router, private toastr: ToastrService, private backend: BackendService, private walletService: WalletService) {
  }

  // Store session data after successful login
  setSession(token: string, userDetails: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('userDetails', JSON.stringify(userDetails));

    this.fetchWalletBalance();
  }
  // Getter for checking logout status
  get isLoggingOut(): boolean {
    return this._isLoggingOut;
  }

  showErrorMessage(message: string) {
    this.toastr.error(message, 'Session Expired');
  }

  // Logout function
  logout(showMessage: boolean = true) {
    if (this._isLoggingOut) return;
    this._isLoggingOut = true;

    this.backend.logout().subscribe({
      next: (response) => {
        if (showMessage) {
          this.toastr.success(response.message, 'Logged out');
        }
        this.clearSession();
      },
      error: (err) => {
        if (showMessage) {
          this.toastr.error('Logout failed. Please try again.', 'Error');
        }
        this.clearSession();
      }
    });
  }
  private clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('userDetails');
    this.router.navigate(['/login']);
    this._isLoggingOut = false;  // Reset flag after logout
  }

  // Check if user is logged in by checking token existence
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Get stored user details
  getUserDetails() {
    const userDetails = localStorage.getItem('userDetails');
    return userDetails ? JSON.parse(userDetails) : null;
  }

  // Check if the user has the specified role
  hasRole(role: string): boolean {
    const userDetails = this.getUserDetails();
    return userDetails && userDetails.role === role;
  }

  // Get the user's role
  getRole(): string | null {
    const userDetails = this.getUserDetails();
    return userDetails ? userDetails.role : null;
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('token');
  }


  fetchWalletBalance() {
    if (this.isLoggedIn()) {
      this.backend.getWalletBalance().subscribe({
        next: (response) => {
          this.walletService.setWalletBalance(response.data.balance);
          this.walletService.setExposure(response.data.exposure);
        },
        error: (err) => {
          console.error('Failed to fetch wallet balance:', err);
          this.logout();
        }
      });
    }
  }
}
