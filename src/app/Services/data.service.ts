import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})

export class DateService {

  constructor(private datePipe: DatePipe) {
  }


  getEndDate(date: any): string {
    if (!date) {
      date = { year: new Date().getFullYear(), month: 1, day: 1 };
    }

    const endDate = new Date(date.year, date.month - 1, date.day);

    // Set the time to 23:59:00
    endDate.setHours(23, 59, 0, 0);

    // Formatting endDate using DatePipe
    const formattedEndDate = this.datePipe.transform(
      endDate,
      'yyyy-MM-ddTHH:mm:ssZ',
    ) as string;

    return formattedEndDate;
  }

  getStartDate(date: any): string {
    if (!date) {
      date = { year: new Date().getFullYear(), month: 1, day: 1 };
    }

    const startDate = new Date(date.year, date.month - 1, date.day);

    // Formatting startDate using DatePipe
    const formattedStartDate = this.datePipe.transform(
      startDate,
      'yyyy-MM-ddTHH:mm:ssZ',
    ) as string;

    return formattedStartDate;
  }
}
