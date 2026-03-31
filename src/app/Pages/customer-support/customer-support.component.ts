import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CONFIG } from '../../../../config';
import { ToastrService } from 'ngx-toastr';
import { log } from 'console';


@Component({
  selector: 'app-customer-support',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './customer-support.component.html',
  styleUrl: './customer-support.component.css'
})
export class CustomerSupportComponent {
  socialForm!: FormGroup;
  isEditModalOpen = false;
  selectedSupport: any = null;
  getSupportList: any = []
  constructor(private http: HttpClient, private fb: FormBuilder, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.socialForm = this.fb.group({
      type: ['whatsapp', Validators.required],
      link: ['', Validators.required],
    });

    this.getSupport();
  }

  onSubmit() {
    if (this.socialForm.valid) {
      this.http.post(CONFIG.addCustomerSupport, this.socialForm.value).subscribe({
        next: (res: any) => {
          this.toaster.success(res.message);
          this.socialForm.reset();
          this.getSupport();
        },
        error: (error) => {
          this.toaster.error('Failed to update support');
        }
      })
    }
  }

  openEditModal(item: any) {
    this.selectedSupport = item;
    this.socialForm.patchValue(item);
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.socialForm.reset();
  }

  onUpdate() {
    if (this.socialForm.valid && this.selectedSupport) {
      const payload = {
        ...this.socialForm.value,
      };

      this.http.put(`${CONFIG.updateCustomerSupport}/${this.selectedSupport._id}`, payload).subscribe({
        next: (res: any) => {
          this.toaster.success(res.message || 'Support updated successfully');
          this.isEditModalOpen = false;
          this.socialForm.reset();
          this.selectedSupport = null;
          this.getSupport();
        },
        error: (err) => {
          console.error(err);
          this.toaster.error('Failed to update support');
        },
      });
    } else {
      this.socialForm.markAllAsTouched();
    }
  }

  getSupport() {
    this.http.get(CONFIG.getCustomerSupport).subscribe((res: any) => {
      this.getSupportList = res.data
    })
  }

  onDelete(item: any) {
    this.http.delete(`${CONFIG.deleteCustomerSupport}${item._id}`).subscribe({
      next: (res: any) => {
        this.toaster.success(res.message || 'Support deleted successfully');
        this.getSupport();
      },
      error: (err) => {
        console.error(err);
        this.toaster.error('Failed to delete support');
      },
    });
  }


}
