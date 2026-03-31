
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from "angular-datatables";
import { IMyDpOptions, MyDatePickerModule } from "@murbanczyk-fp/mydatepicker";
import { DateService } from "../../../Services/data.service";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { BackendService } from "../../../Services/backend.service";
import { ToastrService } from "ngx-toastr";
import { CONFIG } from "../../../../../config";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { DecimalFormatPipe } from "../../../Pipes/decimal-format.pipe";



@Component({
  selector: 'app-bet-history',
  standalone: true,
  imports: [
    MyDatePickerModule, FormsModule, DataTablesModule, CommonModule, DecimalFormatPipe
  ],
  templateUrl: './bet-history.component.html',
  styleUrl: './bet-history.component.css'
})
export class BetHistoryComponent implements OnInit {
  userId: string = '';
  selectedType: string = 'unsettled';
  totals:any
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

  constructor(private dateService: DateService, private http: HttpClient, private route: ActivatedRoute, private backend: BackendService, private toastr: ToastrService) {
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
    if (!this.userId) {
      this.toastr.warning("User ID is missing, no data to display.");
      return;
    }
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
      ajax: (dataTablesParameters: any, callback: any) => {
        this.transactions = [];
        const requestPayload = Object.assign(dataTablesParameters, {
          startDate: this.formattedStartDate,
          endDate: this.formattedEndDate,
          type: this.selectedType,
          userId: this.userId || undefined,
        });


        that.http.post<any>(CONFIG.getUserBetsByParent, requestPayload).subscribe((resp) => {
          let data = resp.data.data.data;
          this.dataTableParam = dataTablesParameters;
          if (Array.isArray(data) && data.length > 0) {
            this.transactions = data;
            this.totals = resp.data.totals;
          }
          callback({
            recordsTotal: resp.data.data.recordsTotal,
            recordsFiltered: resp.data.data.recordsFiltered,
            data: [],
          });
        });
      }
    };
  }

  onFilterChange(): void {
    this.submitDate();
  }
  getAmountColor(stake: string | undefined, cashoutAmount: string | undefined): string {
    if (!stake || !cashoutAmount) return '';
    const difference = parseFloat(stake) - parseFloat(cashoutAmount);
    return difference > 0 ? 'text-green-500' : 'text-red-500';
  }

  calculateDifference(stake: string | undefined, cashoutAmount: string | undefined): string {
    if (!stake || !cashoutAmount) return '0.00';
    const difference = Math.abs(parseFloat(stake) - parseFloat(cashoutAmount));
    return difference.toFixed(2);
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
