import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IMyDpOptions, MyDatePickerModule } from "@murbanczyk-fp/mydatepicker";
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { DecimalFormatterPipe } from '../../Pipes/decimal-formatter.pipe';
import { DateService } from '../../Services/data.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CONFIG } from '../../../../config';

@Component({
  selector: 'app-profit-loss',
  standalone: true,
  imports: [DataTablesModule,
    MyDatePickerModule,
    CommonModule,
    FormsModule,
    DecimalFormatterPipe,],
  templateUrl: './profit-loss.component.html',
  styleUrl: './profit-loss.component.css'
})
export class ProfitLossComponent {
  userId!: string;
  @ViewChild(DataTableDirective)
  dataTableElement!: DataTableDirective;
  // @ts-ignore
  dtOptions: DataTables.Settings = {};
  bets: any[] = [];
  totalDetails!: any;
  public today = new Date();
  math = Math
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
      order: [0, "desc", 5, "desc"],
      ajax: (dataTablesParameters: any, callback: any) => {
        const requestPayload = Object.assign(dataTablesParameters, {
          from: this.formattedStartDate.split('T')[0],
          to: this.formattedEndDate.split('T')[0]
        });

        // if (this.userId) {
        //   requestPayload.userId = this.userId;
        // }

        that.http.post<any>(CONFIG.getReportList, requestPayload).subscribe((resp) => {
          let data = resp?.data?.data;
          this.totalDetails = resp?.data?.totals;
          this.dataTableParam = dataTablesParameters;
          this.bets = data;
          callback({
            recordsTotal: resp?.data.recordsTotal,
            recordsFiltered: resp.data?.recordsFiltered,
            data: [],
          });
        });
      }, columns: [
        { data: 'Total Bets' },
        { data: 'stake' },
        { data: 'eventName' },
        { data: 'totalPl' },
        { data: 'totalPayouts' }
      ]
    };
  }

  
  

  navigateWithRoundId(roundId: number): void {
    this.router.navigate(['/round-bets', roundId]);
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
    const startDate = this.formattedStartDate;
    const endDate = this.formattedEndDate;
    this.router.navigateByUrl(`/round-range/${eventId}/${startDate}/${endDate}`)
  }
}
