import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CONFIG } from '../../../../config';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent implements OnInit {
  eventForm!: FormGroup;
  eventList: any[] = [];
  selectedEvent: any = null;
  isEdit = false;
  showModal = false;
  numbers: number[] = [];
  previewIcon: string | ArrayBuffer | null = null;
  previewImage: string | ArrayBuffer | null = null;
  iconFile: File | null = null;
  imageFile: File | null = null;
  constructor(private http: HttpClient, private fb: FormBuilder, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getEventList()
    this.initForm();
    this.numbers = Array.from({ length: 50 }, (_, i) => i + 1);
  }

  initForm() {
    this.eventForm = this.fb.group({
      eventId: ['', Validators.required],
      eventName: ['', Validators.required],
      sequence: [1, Validators.required],
      link: ['', Validators.required],
      isMaintenance: [false],
      isActive: [true],
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
      this.previewIcon = null;
      this.previewImage = null;
      this.iconFile = null;
      this.imageFile = null;
    }
    this.showModal = true;
  }


  onFileChange(e: Event, type: 'icon' | 'image') {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'icon') {
          this.previewIcon = reader.result;
          this.iconFile = file;
        } else {
          this.previewImage = reader.result;
          this.imageFile = file;
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
    formData.append('eventName', v.eventName);
    formData.append('sequence', v.sequence);
    formData.append('link', v.link);
    formData.append('isMaintenance', v.isMaintenance);
    if (this.isEdit) {
      formData.append('isActive', v.isActive);
    }

    if (this.iconFile) formData.append('icon', this.iconFile);
    if (this.imageFile) formData.append('image', this.imageFile);

    if (this.isEdit) {
      this.http.put(`${CONFIG.updateEvent}/${this.selectedEvent._id}`, formData).subscribe({
        next: (res: any) => {
          this.getEventList();
          this.toastr.success(res.message);
        },
        error: (err) => {

        }
      })
    } else {
      this.http.post(CONFIG.createEvent, formData).subscribe({
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

  updateMaintenance(value: any, event: any) {
    // if (event) {
    //   this.patchForm(event);
    // }

    this.eventForm.get('isMaintenance')?.setValue(value);
    const v = this.eventForm.value;
    const formData = new FormData();
    formData.append('isMaintenance', v.isMaintenance);

    this.http.put(`${CONFIG.updateEvent}/${event._id}`, formData).subscribe({
      next: (res: any) => {
        this.getEventList();
        this.toastr.success(res.message);
      },
      error: (err) => {

      }
    })
  }

  updateActive(value: any, event: any) {
    // if (event) {
    //   this.patchForm(event);
    // }

    this.eventForm.get('isActive')?.setValue(value);
    const v = this.eventForm.value;
    const formData = new FormData();
    formData.append('isActive', v.isActive);

    this.http.put(`${CONFIG.updateEvent}/${event._id}`, formData).subscribe({
      next: (res: any) => {
        this.getEventList();
        this.toastr.success(res.message);
      },
      error: (err) => {

      }
    })
  }

  updateSequence(value: any, event: any) {
    this.eventForm.get('sequence')?.setValue(value);
    const v = this.eventForm.value;
    const formData = new FormData();
    formData.append('sequence', v.sequence);

    this.http.put(`${CONFIG.updateEvent}/${event._id}`, formData).subscribe({
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
  }

  getEventList() {
    this.http.get(CONFIG.getAllEvent).subscribe({
      next: (res: any) => {
        if (res?.data) {
          // ✅ Sort by sequence ascending
          this.eventList = res.data.sort((a: any, b: any) => a.sequence - b.sequence);
        }
      },
      error: (err) => {
        console.error('Failed to fetch events:', err);
      }
    });
  }

}
