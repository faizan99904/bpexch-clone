import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalFormatter',
  standalone: true
})
export class DecimalFormatterPipe implements PipeTransform {

  transform(value: any): any {
    if (value === null || value === undefined) {
      return value;
    }

    const num = parseFloat(value);
    // Check if it's an integer
    if (Number.isInteger(num)) {
      return num;
    }

    // Otherwise, format to at most 2 decimal places
    return num.toFixed(2);
  }
}
