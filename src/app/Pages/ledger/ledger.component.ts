import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IMyDpOptions, MyDatePickerModule } from '@murbanczyk-fp/mydatepicker';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { CONFIG } from '../../../../config';

@Component({
  selector: 'app-ledger',
  standalone: true,
  imports: [CommonModule, DataTablesModule, FormsModule, MyDatePickerModule],
  templateUrl: './ledger.component.html',
  styleUrl: './ledger.component.css'
})
export class LedgerComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dataTableElement!: DataTableDirective;
  userId = '';
  operatorList: any[] = [];
  dataTableParam: any;
  public today = new Date();
  startDate: any;
  formattedStartTime = '';
  formattedEndTime = '';
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
  // @ts-ignore
  dtOptions: DataTables.Settings = {};

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    const firstDayOfMonth = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
    this.startDate = {
      date: {
        year: firstDayOfMonth.getFullYear(),
        month: firstDayOfMonth.getMonth() + 1,
        day: firstDayOfMonth.getDate(),
      },
      isRange: false,
      singleDate: { jsDate: firstDayOfMonth },
    };
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.queryParamMap.get('id') || '';
    this.initializeDataTable();
  }

  initializeDataTable(): void {
    this.setDateRangePayload();
    const that = this;

    this.dtOptions = {
      pagingType: 'full_numbers',
      ordering: false,
      serverSide: true,
      searching: true,
      autoWidth: false,
      processing: false,
      order: [0, 'desc'],
      ajax: (dataTablesParameters: any, callback: any) => {
        const requestPayload = Object.assign(dataTablesParameters, {
          startTime: this.formattedStartTime,
          endTime: this.formattedEndTime,
        });

        if (this.userId) {
          requestPayload.userId = this.userId;
        }

        that.http.post<any>(CONFIG.gerLedger, requestPayload).subscribe({
          next: (resp) => {
            const responseData = resp?.data;
            const tableData = Array.isArray(responseData?.data)
              ? responseData.data
              : Array.isArray(responseData?.data?.data)
                ? responseData.data.data
                : Array.isArray(responseData)
                  ? responseData
                  : [];

            this.dataTableParam = dataTablesParameters;
            this.operatorList = tableData;

            callback({
              recordsTotal: responseData?.recordsTotal ?? responseData?.data?.recordsTotal ?? tableData.length,
              recordsFiltered: responseData?.recordsFiltered ?? responseData?.data?.recordsFiltered ?? tableData.length,
              data: [],
            });
          },
          error: () => {
            this.dataTableParam = dataTablesParameters;
            this.operatorList = [];
            callback({
              recordsTotal: 0,
              recordsFiltered: 0,
              data: [],
            });
          }
        });
      },
      columns: [
        { data: 'createdAt' },
        { data: 'externalPlayerId' },
        { data: 'txId' },
        { data: 'roundId' },
        { data: 'gameId' },
        { data: 'gameName' },
        { data: 'type' },
        { data: 'amount' },
        { data: 'status' }
      ]
    };
  }

  submitDate(): void {
    this.setDateRangePayload();
    // @ts-ignore
    this.dataTableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  private setDateRangePayload(): void {
    this.formattedStartTime = this.getBoundaryTime(this.startDate?.date, 'start');
    this.formattedEndTime = this.getBoundaryTime(this.endDate?.date, 'end');
  }

  private getBoundaryTime(date: any, type: 'start' | 'end'): string {
    const safeDate = date || {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate(),
    };

    const utcDate = type === 'start'
      ? new Date(Date.UTC(safeDate.year, safeDate.month - 1, safeDate.day, 0, 0, 0, 0))
      : new Date(Date.UTC(safeDate.year, safeDate.month - 1, safeDate.day, 23, 59, 59, 999));

    return utcDate.toISOString();
  }
}
