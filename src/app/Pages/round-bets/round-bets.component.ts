import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from "angular-datatables";
import { CommonModule, DatePipe } from "@angular/common";
import { DecimalFormatterPipe } from "../../Pipes/decimal-formatter.pipe";
import { MyDatePickerModule } from "@murbanczyk-fp/mydatepicker";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { CONFIG } from "../../../../config";
import { DecimalFormatPipe } from "../../Pipes/decimal-format.pipe";

@Component({
  selector: 'app-round-bets',
  standalone: true,
  imports: [
    DataTablesModule,
    DatePipe,
    DecimalFormatterPipe,
    MyDatePickerModule,
    CommonModule,
    DecimalFormatPipe
  ],
  templateUrl: './round-bets.component.html',
  styleUrl: './round-bets.component.css'
})
export class RoundBetsComponent implements OnInit {
  roundId!: string;
  totals:any
  @ViewChild(DataTableDirective)
  dataTableElement!: DataTableDirective;
  // @ts-ignore
  dtOptions: DataTables.Settings = {};
  bets: any[] = [];
  dataTableParam: any;



  constructor(private http: HttpClient, private route: ActivatedRoute,) {
  }

  ngOnInit(): void {
    this.roundId = this.route.snapshot.paramMap.get('roundId') || '';
    this.initializeDataTable();
  }

  initializeDataTable(): void {

    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      ordering: false,
      serverSide: true,
      searching: true,
      autoWidth: false,
      processing: false,
      order: [1, "desc"],
      ajax: (dataTablesParameters: any, callback: any) => {
        const requestPayload = Object.assign(dataTablesParameters, {
          roundId: this.roundId
        });


        that.http.post<any>(CONFIG.getRoundBets, requestPayload).subscribe((resp) => {
          let data = resp.data.data.data;
          this.totals = resp.data.totals
          this.dataTableParam = dataTablesParameters;
          if (Array.isArray(data) && data.length > 0) {
            this.bets = data
          }
          callback({
            recordsTotal: resp?.data?.data?.recordsTotal,
            recordsFiltered: resp?.data?.data?.recordsFiltered,
            data: [],
          });
        });
      }, columns: [{ data: 'roundNumber', orderable: true }, { data: 'totalBets', orderable: true }, { data: 'Stakes', orderable: true }, { data: 'cashoutAmount', orderable: true }, { data: 'totalPl', orderable: false }, { data: 'createdAt', orderable: false }]
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


}
