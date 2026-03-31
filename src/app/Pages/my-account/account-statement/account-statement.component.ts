import {Component, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective, DataTablesModule} from "angular-datatables";
import {CommonModule, DatePipe, NgForOf, NgIf} from "@angular/common";
import {IMyDpOptions, MyDatePickerModule} from "@murbanczyk-fp/mydatepicker";
import {DateService} from "../../../Services/data.service";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {CONFIG} from "../../../../../config";
import {FormsModule} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {DecimalFormatPipe} from "../../../Pipes/decimal-format.pipe";

@Component({
  selector: 'app-account-statement',
  standalone: true,
  imports: [
    DataTablesModule,
    DatePipe,
    MyDatePickerModule,
   CommonModule,
    FormsModule,
    DecimalFormatPipe
  ],
  templateUrl: './account-statement.component.html',
  styleUrl: './account-statement.component.css'
})
export class AccountStatementComponent implements OnInit {
  userId!: string;
  @ViewChild(DataTableDirective)
  dataTableElement!: DataTableDirective;
  // @ts-ignore
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
  totalDeposit: number = 0;
  totalWithdraw: number = 0;

  constructor(private dateService:DateService,private http:HttpClient,private route: ActivatedRoute,private toastr:ToastrService) {
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
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId') ?? '';
      this.initializeDataTable()
    });
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
      order: [0, "desc"],
      ajax: (dataTablesParameters: any, callback:any) => {
        this.transactions = []
        const requestPayload = Object.assign(dataTablesParameters, {
          startDate: this.formattedStartDate,
          endDate: this.formattedEndDate
        });

        if (this.userId) {
          requestPayload.userId = this.userId;
        }

        that.http.post<any>(CONFIG.getAllStatement, requestPayload).subscribe((resp) => {
          let data = resp.data.data;
          this.dataTableParam = dataTablesParameters;
          if (Array.isArray(data) && data.length > 0) {
            this.transactions = data;
            this.calculateTotals();
          }
          callback({
            recordsTotal: resp.data.recordsTotal || 0,
            recordsFiltered: resp.data.recordsFiltered || 0,
            data: [],
          });
        });
      }
    };
  }
  calculateTotals() {
    this.totalDeposit = this.transactions.reduce((acc, transaction) => acc + (transaction.deposit || 0), 0);
    this.totalWithdraw = this.transactions.reduce((acc, transaction) => acc + (transaction.withdraw || 0), 0);
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
