import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CONFIG } from '../../../../config';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-user-report-history',
  standalone: true,
  imports: [CommonModule, DataTablesModule],
  templateUrl: './user-report-history.component.html',
  styleUrl: './user-report-history.component.css'
})
export class UserReportHistoryComponent {
  dtOptions: DataTables.Settings = {};
  tableData: any[] = [];
  userId: string = '';
  role: string = '';
  eventId: string = '';
  roundId: string = '';
  public Math = Math;
  isSuperAdmin = false;

  getDecimalValue(value: any): number {
    if (value === null || value === undefined) {
      return 0;
    }
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      const parsed = Number(value);
      return Number.isNaN(parsed) ? 0 : parsed;
    }
    if (typeof value === 'object') {
      if ('$numberDecimal' in value) {
        return this.getDecimalValue(value.$numberDecimal);
      }
      if ('$numberDouble' in value) {
        return this.getDecimalValue(value.$numberDouble);
      }
      if ('$numberInt' in value) {
        return this.getDecimalValue(value.$numberInt);
      }
    }
    return 0;
  }

  formatDecimal(value: any, digits = 2): string {
    return this.getDecimalValue(value).toFixed(digits);
  }

  @ViewChild(DataTableDirective, { static: false })
  dataTableDirective!: DataTableDirective;

  constructor(private http: HttpClient, private route: ActivatedRoute, private authService: AuthService) {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId') ?? '';
      this.role = (params.get('role') ?? '').trim().toUpperCase();
      this.eventId = params.get('eventId') ?? '';
      this.roundId = params.get('roundId') ?? '';
    });
    this.isSuperAdmin = (this.authService.getRole() || '').toLowerCase() === 'super';
  }

  ngOnInit(): void {
    this.initializeDataTable();
  }

  initializeDataTable(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      ordering: false,
      serverSide: true,
      searching: true,
      autoWidth: false,
      processing: false,
      ajax: (dataTablesParameters: any, callback: any) => {
        const payload = {
          ...dataTablesParameters,
          columns: [],
          round: this.roundId,
          eventId: this.eventId,
          userId: this.userId || undefined
        };

        const apiUrl = this.role === 'USER' ? CONFIG.roundHistory : CONFIG.getUserBets;

        this.http.post<any>(apiUrl, payload).subscribe((resp) => {
          this.tableData = resp.data?.data || resp.data?.data?.data || [];
          callback({
            recordsTotal: resp?.data?.recordsTotal ?? resp?.data?.data?.recordsTotal ?? 0,
            recordsFiltered: resp?.data?.recordsFiltered ?? resp?.data?.data?.recordsFiltered ?? 0,
            data: [],
          });
        });
      },
      columns: [
        { data: 'eventName' },
        { data: 'round' },
        { data: 'stake' },
        { data: 'cashoutAmount' },
        { data: 'pl' },
        { data: 'result' },
        { data: 'betType' },
        { data: 'outcome' },
        { data: 'placedAt' },
        { data: 'settledAt' }
      ]
    };
  }
}
