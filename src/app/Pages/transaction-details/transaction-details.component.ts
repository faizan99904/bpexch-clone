import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from "angular-datatables";
import { IMyDpOptions, MyDatePickerModule } from "@murbanczyk-fp/mydatepicker";
import { DateService } from "../../Services/data.service";
import { HttpClient } from "@angular/common/http";
import { CONFIG } from "../../../../config";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import { DecimalFormatterPipe } from "../../Pipes/decimal-formatter.pipe";

@Component({
  selector: 'app-transaction-details',
  standalone: true,
  imports: [
    MyDatePickerModule, FormsModule, DataTablesModule, CommonModule,
    DecimalFormatterPipe
  ],
  templateUrl: './transaction-details.component.html',
  styleUrl: './transaction-details.component.css'
})
export class TransactionDetailsComponent implements OnInit {
  userId!: string;
  @ViewChild(DataTableDirective)
  dataTableElement!: DataTableDirective;
  // @ts-ignore
  message: any
  dtOptions: DataTables.Settings = {};
  transactions: any[] = [];
  public today = new Date();
  startDate: any;
  dataTableParam: any;
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

  constructor(private dateService: DateService, private http: HttpClient, private route: ActivatedRoute) {
    const yesterday = new Date(this.today);
    yesterday.setDate(this.today.getDate() - 1);
    this.startDate = {
      date: {
        year: this.today.getFullYear(),
        month: this.today.getMonth() + 1,
        day: this.today.getDate() - 1,
      },
      isRange: false,
      singleDate: { jsDate: yesterday },
    };
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.initializeDataTable();
  }

  initializeDataTable(): void {
    this.formattedStartDate = this.dateService.getStartDate(this.startDate.date);
    this.formattedEndDate = this.dateService.getEndDate(this.endDate.date);

    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      ordering: false,
      serverSide: true,
      searching: true,
      autoWidth: false,
      processing: false,
      order: [2, "desc"],
      ajax: (dataTablesParameters: any, callback: any) => {
        const requestPayload = Object.assign(dataTablesParameters, {
          startDate: this.formattedStartDate,
          endDate: this.formattedEndDate
        });

        if (this.userId) {
          requestPayload.userId = this.userId;
        }

        that.http.post<any>(CONFIG.getAllStatement, requestPayload).subscribe((resp) => {
          let data = resp?.data?.data || [];
          this.message = resp?.message
          this.dataTableParam = dataTablesParameters;
          if (data.length > 0) {
            this.transactions = data;
          } else {
            this.transactions = [];
          }

          const recordsTotal = resp?.data?.recordsTotal || 0;
          const recordsFiltered = resp?.data?.recordsFiltered || 0;
          callback({
            recordsTotal: recordsTotal,
            recordsFiltered: recordsFiltered,
            data: data,
          });

        });
      },
      columns: [
        { data: null },
        { data: 'username' },
        { data: 'createdAt' },
        { data: 'deposit' },
        { data: 'withdraw' },
        { data: 'bankBalance' },
        { data: 'remarks', defaultContent: '-' }
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


}
