import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from "angular-datatables";
import { IMyDpOptions, MyDatePickerModule } from "@murbanczyk-fp/mydatepicker";
import { CommonModule } from "@angular/common";
import { DateService } from "../../Services/data.service";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { CONFIG } from "../../../../config";
import { FormsModule } from "@angular/forms";
import { DecimalFormatPipe } from "../../Pipes/decimal-format.pipe";

@Component({
  selector: 'app-bets',
  standalone: true,
  imports: [
    DataTablesModule,
    MyDatePickerModule,
    CommonModule,
    FormsModule,
    DecimalFormatPipe
  ],
  templateUrl: './bets.component.html',
  styleUrl: './bets.component.css'
})
export class BetsComponent implements OnInit {
  userId!: string;
  @ViewChild(DataTableDirective)
  dataTableElement!: DataTableDirective;
  // @ts-ignore
  dtOptions: DataTables.Settings = {};
  bets: any[] = [];
  totalDetails!: any;
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

  constructor(private dateService: DateService, private http: HttpClient, private route: ActivatedRoute,) {
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
      order: [1, "desc", 6, "desc", 7, "desc",],
      ajax: (dataTablesParameters: any, callback: any) => {
        const payload = {
          ...dataTablesParameters,
          columns: [],
          startDate: this.formattedStartDate,
          endDate: this.formattedEndDate,
        }

        if (this.userId) {
          payload.userId = this.userId;
        }

        that.http.post<any>(CONFIG.getAllBets, payload).subscribe((resp) => {
          let data = resp.data?.data?.data;
          this.totalDetails = resp?.data?.totals
          this.dataTableParam = dataTablesParameters;
          if (Array.isArray(data) && data.length > 0) {
            this.bets = data;
          }
          callback({
            recordsTotal: resp?.data?.data?.recordsTotal,
            recordsFiltered: resp?.data?.data?.recordsFiltered,
            data: [],
          });
        });
      }
    };
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
