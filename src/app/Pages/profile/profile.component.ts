import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from "ngx-toastr";
import { BackendService } from "../../Services/backend.service";
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../../../../config';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgClass, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  constructor(private fb: FormBuilder, private toastr: ToastrService, private backend: BackendService, private http: HttpClient) { }


  ngOnInit(): void {
    this.getBonus()
  }

  bankForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    iban: ['', [Validators.required, Validators.pattern('^[A-Z]{2}[0-9]{2}[a-zA-Z0-9]{11,30}$')]], // Adjust IBAN regex as needed
    bankName: ['', [Validators.required]]
  });

  passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required, Validators.minLength(8)]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]]
  });

  bonusForm = this.fb.group({
    BonusAmount: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.bankForm.valid) {
      console.log('Form Submitted!', this.bankForm.value);
    } else {
      console.log('Form is not valid');
    }
  }

  onChangePassword() {
    if (this.passwordForm.invalid) {
      this.toastr.error('Please fill out the form correctly.', 'Error');
      return;
    }

    const payload = {
      currentPassword: this.passwordForm.get('currentPassword')?.value,
      newPassword: this.passwordForm.get('newPassword')?.value
    };

    this.backend.changeUserPassword(payload).subscribe({
      next: (response) => {
        // Assuming response contains a message property on success
        this.toastr.success(response.message || 'Password changed successfully!', 'Success');
        this.passwordForm.reset();  // Reset form after success
      },
      error: (error) => {
        // Assuming error response contains a message property
        const errorMessage = error.error?.message || 'Failed to change password. Please try again.';
        this.toastr.error(errorMessage, 'Error');
      }
    });
  }

  updateBonus() {

    if (this.bonusForm.valid) {
      this.http.post(CONFIG.updateBonus, this.bonusForm.value).subscribe({
        next: (data: any) => {
          this.toastr.success(data.message)
          this.getBonus()
        },
        error: (error: any) => {
          this.toastr.success(error.message)
        }
      })
    }
  }

  getBonus() {
    this.http.post(CONFIG.getBonus, {}).subscribe((resp: any) => {
      this.bonusForm.get('BonusAmount')?.setValue(resp.data.BonusAmount)
    })
  }

}
