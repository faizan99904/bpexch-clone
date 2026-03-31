import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'decimalFormat'
})
export class DecimalFormatPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined) {
      return '';
    }

    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(numberValue) ? '' : numberValue.toFixed(2);
  }
}
