import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import flatpickr from 'flatpickr';

@Component({
  selector: 'app-calender',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './calender.component.html',
  styleUrl: './calender.component.css'
})
export class CalenderComponent implements OnInit {
  isCalender: boolean = false;
  @ViewChild('datePickerInput', { static: true }) datePickerInput!: ElementRef;
  @ViewChild('datePickerInputSecond', { static: true }) datePickerInputSecond!: ElementRef;
  private flatpickrInstance: any;
  private datePickerInputSecondInstance: any;

  ngOnInit(): void {
    const currentDate = new Date();
    const defaultDate = `${currentDate.getFullYear()}-${('0' + (currentDate.getMonth() + 1)).slice(-2)}-${('0' + currentDate.getDate()).slice(-2)} ${('0' + currentDate.getHours()).slice(-2)}:${('0' + currentDate.getMinutes()).slice(-2)}`;
    
    console.log(defaultDate);
    
    this.flatpickrInstance = flatpickr(this.datePickerInput.nativeElement, {
      altInput: true,
      enableTime: true,
      dateFormat: "Y-m-d  H:i",
      altFormat: 'm/d/Y    h:i   K',
      defaultDate: [defaultDate],
      minuteIncrement: 1 
    });

    this.datePickerInputSecondInstance = flatpickr(this.datePickerInputSecond.nativeElement, {
      altInput: true,
      enableTime: true,
      dateFormat: "Y-m-d  H:i",
      altFormat: 'm/d/Y    h:i   K',
      defaultDate: [defaultDate],
      minuteIncrement: 1 
    });
  }

  togleDateTimePicker() {
    if (this.flatpickrInstance) {
      this.flatpickrInstance.open();
    }
  }

  togleSecondDateTimePicker() {
    if (this.datePickerInputSecondInstance) {
      this.datePickerInputSecondInstance.open();
    }
  }
  isButtonOneClicked: boolean = false;
  isButtonTwoClicked: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  onMouseDown(button: string) {
    if (button === 'buttonOne') {
      this.isButtonOneClicked = true;
    } else if (button === 'buttonTwo') {
      this.isButtonTwoClicked = true;
    }
    this.cdr.detectChanges();  // Force Angular to detect changes
  }

  onMouseUp(button: string) {
    if (button === 'buttonOne') {
      this.isButtonOneClicked = false;
    } else if (button === 'buttonTwo') {
      this.isButtonTwoClicked = false;
    }
    this.cdr.detectChanges();  // Force Angular to detect changes
  }


}
