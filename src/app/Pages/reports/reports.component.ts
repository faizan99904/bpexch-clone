import {Component, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective, DataTablesModule} from "angular-datatables";
import {IMyDpOptions, MyDatePickerModule} from "@murbanczyk-fp/mydatepicker";
import {CommonModule} from "@angular/common";
import {DateService} from "../../Services/data.service";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {CONFIG} from "../../../../config";
import {FormsModule} from "@angular/forms";
import {DecimalFormatterPipe} from "../../Pipes/decimal-formatter.pipe";
@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    DataTablesModule,
    MyDatePickerModule,
    CommonModule,
    FormsModule,
    DecimalFormatterPipe,
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit{
  userId!: string;
  @ViewChild(DataTableDirective)
  dataTableElement!: DataTableDirective;
  // @ts-ignore
  dtOptions: DataTables.Settings = {};
  bets: any[] = [];
  totalDetails!:any;
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

  constructor(private dateService:DateService,private http:HttpClient,private route: ActivatedRoute,private router: Router) {
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
      order: [0, "desc", 5, "desc"],
      ajax: (dataTablesParameters: any, callback:any) => {
        const requestPayload = Object.assign(dataTablesParameters, {
          startDate: this.formattedStartDate,
          endDate: this.formattedEndDate
        });

        // if (this.userId) {
        //   requestPayload.userId = this.userId;
        // }

        that.http.post<any>(CONFIG.getRoundPl, requestPayload).subscribe((resp) => {
          let data = resp?.data?.data?.data;
          this.totalDetails = resp?.data?.totals;
          this.dataTableParam = dataTablesParameters;
          if (Array.isArray(data) && data.length > 0) {
            this.bets = data;
            console.log(data)
          }
          callback({
            recordsTotal: resp?.data?.data.recordsTotal,
            recordsFiltered: resp.data?.data?.recordsFiltered,
            data: [],
          });
        });
      },columns: [{ data: 'roundNumber',orderable: true }, { data: 'totalBets',orderable: true}, { data: 'Stakes',orderable: true },{ data: 'cashoutAmount',orderable: true }, { data: 'totalPl',orderable: false }, { data: 'createdAt',orderable: false }]
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

}
