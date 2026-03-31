import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { CONFIG } from '../../../../config';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report-history',
  standalone: true,
  imports: [DataTablesModule, CommonModule],
  templateUrl: './report-history.html',
  styleUrl: './report-history.css'
})
export class reportHistory {
  dtOptions: DataTables.Settings = {};
  eventId: any
  public Math = Math;
  startDate: any
  endDate: any
  math = Math
  tableData: any = [];
  isLoader: boolean = false
  @ViewChild(DataTableDirective, { static: false })
  dataTableDirective!: DataTableDirective
  filterForm: any
  roundNumber: any
  isSuperAdmin = false

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute, private authService: AuthService) {
    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('eventId')
      this.roundNumber = params.get('roundId')
    });
    this.isSuperAdmin = (this.authService.getRole() || '').toLowerCase() === 'super';
  }

  ngOnInit(): void {
    this.initializeDataTable();
  }





  private formatDate(dateString: string | null): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }


  initializeDataTable(): void {
    this.isLoader = true
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      ordering: false,
      serverSide: true,
      searching: true,
      autoWidth: false,
      processing: false,
      ajax: (dataTablesParameters: any, callback: any) => {
        const payload = {
          ...dataTablesParameters,
          columns: [],
          round: this.roundNumber,
          eventId: this.eventId
        }
        that.http.post<any>(CONFIG.getUserBets, payload).subscribe((resp) => {
          let data = resp.data?.data;
          this.tableData = resp.data?.data
          this.isLoader = false
          callback({
            recordsTotal: resp?.data?.recordsTotal,
            recordsFiltered: resp?.data?.recordsFiltered,
            data: [],
          });
        });
      },
      columns: [
        { data: 'Total Bets' },
        { data: 'stake' },
        { data: 'eventName' },
        { data: 'totalPl' },
        { data: 'totalPayouts' },
        { data: 'round no' },
        { data: 'settled no' },
        { data: 'totalPayouts' }
      ]
    };
  }

  filterData() {
    this.dataTableDirective.dtInstance.then((dtInstance: any) => {
      dtInstance.draw();
    })
  }

}
