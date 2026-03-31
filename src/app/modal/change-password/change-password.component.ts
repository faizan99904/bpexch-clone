import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BackendService } from '../../Services/backend.service';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  @Output() close = new EventEmitter<void>();

  isSubmitting = false;
  showCurrentPassword = false;
  showNewPassword = false;

  changePasswordForm = this.fb.group({
    currentPassword: ['', [Validators.required, Validators.minLength(8)]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor(
    private fb: FormBuilder,
    private backend: BackendService,
    private toastr: ToastrService
  ) {}

  onClose() {
    this.changePasswordForm.reset();
    this.close.emit();
  }

  toggleCurrentPassword() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  onSubmit() {
    if (this.changePasswordForm.invalid) {
      this.toastr.error('Please fill out the form correctly.', 'Error');
      return;
    }

    const payload = {
      currentPassword: this.changePasswordForm.get('currentPassword')?.value,
      newPassword: this.changePasswordForm.get('newPassword')?.value
    };

    this.isSubmitting = true;
    this.backend.changeUserPassword(payload).subscribe({
      next: (response) => {
        this.toastr.success(response.message || 'Password changed successfully!', 'Success');
        this.isSubmitting = false;
        this.onClose();
      },
      error: (error) => {
        const errorMessage = error.error?.message || 'Failed to change password. Please try again.';
        this.toastr.error(errorMessage, 'Error');
        this.isSubmitting = false;
      }
    });
  }
}
