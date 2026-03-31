import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CONFIG } from '../../../../config';

@Component({
  selector: 'app-user-round-range',
  standalone: true,
  imports: [CommonModule, DataTablesModule],
  templateUrl: './user-round-range.component.html',
  styleUrl: './user-round-range.component.css'
})
export class UserRoundRangeComponent {
  dtOptions: DataTables.Settings = {};
  eventId: any;
  userId: any;
  role: string = '';
  startDate: any;
  endDate: any;
  math = Math;
  tableData: any = [];
  isLoader = false;
  @ViewChild(DataTableDirective, { static: false })
  dataTableDirective!: DataTableDirective;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('eventId');
      this.userId = params.get('userId');
      this.role = (params.get('role') ?? '').trim().toUpperCase();
      const end = params.get('to');
      const start = params.get('from');
      this.startDate = this.formatDate(start);
      this.endDate = this.formatDate(end);
    });
  }

  ngOnInit(): void {
    this.initializeDataTable();
  }

  private formatDate(dateString: string | null): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  initializeDataTable(): void {
    this.isLoader = true;
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
          endDate: this.endDate,
          startDate: this.startDate,
          eventId: this.eventId,
          userId: this.userId || undefined
        };

        const apiUrl = this.role === 'USER' ? CONFIG.roundsRange : CONFIG.getRoundRange;
        this.http.post<any>(apiUrl, payload).subscribe((resp: any) => {
          this.tableData = resp.data?.data || [];
          this.isLoader = false;
          callback({
            recordsTotal: resp?.data?.recordsTotal || 0,
            recordsFiltered: resp?.data?.recordsFiltered || 0,
            data: [],
          });
        });
      },
      columns: [
        { data: 'eventName' },
        { data: 'roundNumber' },
        { data: 'totalStake' },
        { data: 'totalPayouts' },
        { data: 'totalPL' },
        { data: 'totalBets' },
        { data: 'updatedAt' }
      ]
    };
  }

  navigateToHistory(roundNo: any, eventId: any) {
    this.router.navigateByUrl(`/my-account/user-report-history/${this.userId}/${this.role}/${eventId}/${roundNo}`);
  }
}
