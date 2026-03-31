import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IMyDpOptions, MyDatePickerModule } from '@murbanczyk-fp/mydatepicker';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { DateService } from '../../Services/data.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CONFIG } from '../../../../config';

@Component({
  selector: 'app-user-pl-report',
  standalone: true,
  imports: [DataTablesModule, MyDatePickerModule, CommonModule, FormsModule],
  templateUrl: './user-pl-report.component.html',
  styleUrl: './user-pl-report.component.css'
})
export class UserPlReportComponent implements OnInit {
  userId: string = '';
  role: string = '';
  @ViewChild(DataTableDirective)
  dataTableElement!: DataTableDirective;
  // @ts-ignore
  dtOptions: DataTables.Settings = {};
  reports: any[] = [];
  totalDetails: any;
  math = Math;
  public today = new Date();
  startDate: any;
  formattedStartDate: any;
  formattedEndDate: any;
  endDate: any = {
    date: {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate(),
    },
    isRange: false,
    singleDate: { jsDate: new Date() },
  };
  myDpOptions: IMyDpOptions = {
    dateFormat: 'dd-mm-yyyy',
    markCurrentDay: true,
    monthSelector: false,
    showTodayBtn: false,
    showClearDateBtn: false,
    inline: false,
    editableDateField: false,
    openSelectorOnInputClick: true,
  };

  constructor(private dateService: DateService, private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    this.startDate = {
      date: {
        year: oneWeekAgo.getFullYear(),
        month: oneWeekAgo.getMonth() + 1,
        day: oneWeekAgo.getDate(),
      },
      isRange: false,
      singleDate: { jsDate: oneWeekAgo },
    };
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId') ?? '';
      this.role = (params.get('role') ?? '').trim().toUpperCase();
      this.initializeDataTable();
    });
  }

  initializeDataTable(): void {
    this.formattedStartDate = this.dateService.getStartDate(this.startDate.date);
    this.formattedEndDate = this.dateService.getEndDate(this.endDate.date);

    this.dtOptions = {
      pagingType: 'full_numbers',
      ordering: false,
      serverSide: true,
      searching: true,
      autoWidth: false,
      processing: false,
      order: [0, "desc", 3, "desc"],
      ajax: (dataTablesParameters: any, callback: any) => {
        const requestPayload = Object.assign(dataTablesParameters, {
          from: this.formattedStartDate.split('T')[0],
          to: this.formattedEndDate.split('T')[0],
          userId: this.userId || undefined
        });
        const apiUrl = this.role === 'USER' ? CONFIG.userPlReport : CONFIG.getReportList;

        this.http.post<any>(apiUrl, requestPayload).subscribe((resp) => {
          const rows = resp?.data?.data ?? resp?.data?.data?.data ?? [];
          this.totalDetails = resp?.data?.totals ?? resp?.data?.data?.totals;
          this.reports = Array.isArray(rows) ? rows : [];

          callback({
            recordsTotal: resp?.data?.recordsTotal ?? resp?.data?.data?.recordsTotal ?? 0,
            recordsFiltered: resp?.data?.recordsFiltered ?? resp?.data?.data?.recordsFiltered ?? 0,
            data: [],
          });
        });
      },
      columns: [
        { data: 'eventName' },
        { data: 'totalStake' },
        { data: 'totalPayouts' },
        { data: 'totalPl' },
        { data: 'totalBets' }
      ]
    };
  }

 

  submitDate() {
    this.formattedStartDate = this.dateService.getStartDate(this.startDate.date);
    this.formattedEndDate = this.dateService.getEndDate(this.endDate.date);
    // @ts-ignore
    this.dataTableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  navigateToRound(eventId: any) {
    const to = this.formattedEndDate;
    const from = this.formattedStartDate;
    this.router.navigateByUrl(`/my-account/user-round/${this.userId}/${this.role}/${to}/${from}/${eventId}`);
  }
}
