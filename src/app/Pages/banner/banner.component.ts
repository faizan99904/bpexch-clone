import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CONFIG } from '../../../../config';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent {
  eventForm!: FormGroup;
  isDelete: boolean = false
  deleteId: any
  eventList: any[] = [];
  selectedEvent: any = null;
  isEdit = false;
  showModal = false;
  numbers: number[] = [];
  previewIcon: string | ArrayBuffer | null = null;
  previewImage: string | ArrayBuffer | null = null;
  iconFile: File | null = null;
  imageFile: File | null = null;
  previewMobileImage: string | ArrayBuffer | null = null;
  mobileImageFile: File | null = null;

  constructor(private http: HttpClient, private fb: FormBuilder, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getEventList()
    this.initForm();
    this.numbers = Array.from({ length: 50 }, (_, i) => i + 1);
  }

  initForm() {
    this.eventForm = this.fb.group({
      eventId: ['', Validators.required],
      sequence: [1, Validators.required],
    });
  }

  openModal(event?: any) {
    if (event) {
      this.isEdit = true;
      this.selectedEvent = event;
      this.patchForm(event);
    } else {
      this.isEdit = false;
      this.selectedEvent = null;
      this.eventForm.reset({ sequence: 1, isActive: true });
      this.previewImage = null;
      this.previewMobileImage = null;
      this.imageFile = null;
    }
    this.showModal = true;
  }


  onFileChange(e: Event, type: 'image' | 'mobileImage') {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'image') {
          this.previewImage = reader.result;
          this.imageFile = file;
        } else {
          this.previewMobileImage = reader.result;
          this.mobileImageFile = file;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.eventForm.invalid) return;

    const v = this.eventForm.value;
    const formData = new FormData();
    formData.append('eventId', v.eventId);
    formData.append('sequence', v.sequence);
    if (this.imageFile) formData.append('image', this.imageFile);
    if (this.mobileImageFile) formData.append('mobileImage', this.mobileImageFile);


    if (this.isEdit) {
      this.http.put(`${CONFIG.updateBanner}/${this.selectedEvent._id}`, formData).subscribe({
        next: (res: any) => {
          this.getEventList();
          this.toastr.success(res.message);
        },
        error: (err) => {

        }
      })
    } else {
      this.http.post(CONFIG.addBanner, formData).subscribe({
        next: (res: any) => {
          this.getEventList();
          this.toastr.success(res.message);
        },
        error: (err) => {

        }
      })

    }

    this.closeModal();
  }



  updateSequence(value: any, event: any) {
    this.eventForm.get('sequence')?.setValue(value);
    const v = this.eventForm.value;
    const formData = new FormData();
    formData.append('sequence', v.sequence);

    this.http.put(`${CONFIG.updateBanner}/${event._id}`, formData).subscribe({
      next: (res: any) => {
        this.getEventList();
        this.toastr.success(res.message);
      },
      error: (err) => {

      }
    })
  }


  closeModal() {
    this.showModal = false;
  }

  patchForm(event: any) {
    this.eventForm.patchValue({
      eventId: event.eventId,
      eventName: event.eventName,
      sequence: event.sequence,
      link: event.link,
      isMaintenance: event.isMaintenance,
      isActive: event.isActive,
    });
    this.previewIcon = event.icon;
    this.previewImage = event.image;
    this.previewMobileImage = event.mobileImage;
  }

  getEventList() {
    this.http.post(CONFIG.getBanner, {}).subscribe({
      next: (res: any) => {
        if (res?.data) {

          this.eventList = res.data.sort((a: any, b: any) => a.sequence - b.sequence);
        }
      },
      error: (err) => {
        console.error('Failed to fetch events:', err);
      }
    });
  }

  openDeleteModal(id: any) {
    this.isDelete = !this.isDelete
    this.deleteId = id
  }

  deleteBanner() {
    if (this.deleteId) {
      this.http.delete(`${CONFIG.deleteBanner}/${this.deleteId._id}`).subscribe({
        next: (res: any) => {
          this.toastr.success(res.message);
          this.isDelete = false;
          this.getEventList();
        },
        error: (error: any) => {
          this.toastr.error(error.error.message)
        }
      })
    }

  }

}
