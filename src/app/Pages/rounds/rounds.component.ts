import { Component, OnInit, ViewChild } from '@angular/core';
import { IMyDpOptions, MyDatePickerModule } from "@murbanczyk-fp/mydatepicker";
import { FormsModule } from "@angular/forms";
import { DateService } from "../../Services/data.service";
import { DataTableDirective, DataTablesModule } from "angular-datatables";
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { CONFIG } from "../../../../config";
import { HttpClient } from "@angular/common/http";
import { BackendService } from "../../Services/backend.service";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../Services/auth.service";

@Component({
  selector: 'app-rounds',
  standalone: true,
  imports: [MyDatePickerModule, FormsModule, DataTablesModule, NgForOf, NgIf, DatePipe],
  templateUrl: './rounds.component.html',
  styleUrl: './rounds.component.css'
})
export class RoundsComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dataTableElement!: DataTableDirective;
  // @ts-ignore
  dtOptions: DataTables.Settings = {};
  rounds: any[] = [];
  searchRoundId: string = '';
  searchedRounds: any[] = [];
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

  constructor(private dateService: DateService, private http: HttpClient, private backend: BackendService, private toastr: ToastrService, public authService: AuthService) {
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

  ngOnInit() {
    this.initializeDataTable();
  }

  initializeDataTable() {
    this.formattedStartDate = this.dateService.getStartDate(this.startDate.date);
    this.formattedEndDate = this.dateService.getEndDate(this.endDate.date);
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      ordering: true,
      serverSide: true,
      searching: true,

      autoWidth: false,
      processing: false,
      order: [[2, 'desc']],
      ajax: (dataTablesParameters: any, callback: any) => {
        const payload = {
          ...dataTablesParameters,
          columns: [], 
          startDate: this.formattedStartDate,
          endDate: this.formattedEndDate,
        };

        that.http.post<any>(CONFIG.getAllRounds, payload).subscribe((resp) => {
          let data = resp.data.data;
          this.dataTableParam = dataTablesParameters
          if (Array.isArray(data) && data.length > 0) {
            this.rounds = data;
          }
          callback({
            recordsTotal: resp.data.recordsTotal,
            recordsFiltered: resp.data.recordsFiltered,
            data: [],
          });
        })
      },
      columns: [
        { data: 'round', orderable: true, searchable: true,  },
        { data: 'eventId', orderable: true, searchable: true, },
        { data: 'multiplier', orderable: true },
        { data: 'createdAt', orderable: true, searchable: true },
        { data: 'updatedAt', orderable: true, searchable: true },
        { data: 'actions', orderable: false }
      ],
    };
  }

  settleRound(roundId: string): void {
    // Check if the user has the 'super' role
    if (!this.authService.hasRole('SUPER')) {
      this.toastr.error('You do not have permission to perform this action.');
      return;
    }

    // Proceed to call the API if the role is 'super'
  
    this.backend.betSattlement(this.searchRoundId).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.toastr.success(response?.message);
        } else {
          this.toastr.error(response.message || 'Failed to settle the round');
        }
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'An error occurred while settling the round');
      }
    });
  }



  submitDate() {
    this.formattedStartDate = this.dateService.getStartDate(this.startDate.date);
    this.formattedEndDate = this.dateService.getEndDate(this.endDate.date);
    // @ts-ignore
    this.dataTableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  searchRoundById() {
    if (this.searchRoundId.trim() !== '') {
      this.backend.getRoundById(this.searchRoundId).subscribe((response: any) => {
        if (response.status === 'success' && response.data) {
          this.searchedRounds = [response.data];
        }
      });
    }
  }

}
