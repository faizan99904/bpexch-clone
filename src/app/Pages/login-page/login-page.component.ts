import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BackendService } from '../../Services/backend.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Services/auth.service';
import { catchError, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  loginData = {
    username: '',
    password: ''
  };
  errorMessage: string = '';
  showPassword = false

  togglePassword() {
    this.showPassword = !this.showPassword
  }



  constructor(
    private backend: BackendService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  onLogin() {
    if (!this.loginData.username || !this.loginData.password) {
      this.toastr.error('Please enter both username and password', 'Validation Error');
      return;
    }
    this.loginData.username = this.loginData.username.toLowerCase();
    console.log(this.loginData.username);
    const fallbackIpInfo = {
      ip: '0',
      city: '0',
      region: '0',
      country: '0',
      loc: '0',
      org: '0',
      postal: '0',
      timezone: '0',
    };

    this.backend.getIpInfo().pipe(
      catchError(() => of(fallbackIpInfo)),
      switchMap((ipInfo) => {
        const payload = { ...this.loginData, ipInfo: ipInfo || fallbackIpInfo };
        return this.backend.login(payload);
      })
    ).subscribe({
      next: (response) => {
        if (response.data && response.data.token && response.data.userDetails) {
          this.authService.setSession(response.data.token, response.data.userDetails);
          this.router.navigate(['/dashboard']);
        } else {
          this.toastr.error('Unexpected response format', 'Error');
        }
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Login failed. Please try again.';
        this.toastr.error(this.errorMessage, 'Error');
      }
    });

  }

}
