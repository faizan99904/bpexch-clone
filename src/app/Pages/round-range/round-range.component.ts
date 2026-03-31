import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { CONFIG } from '../../../../config';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-round-range',
  standalone: true,
  imports: [CommonModule, DataTablesModule],
  templateUrl: './round-range.component.html',
  styleUrl: './round-range.component.css'
})
export class RoundRangeComponent {
  dtOptions: DataTables.Settings = {};
  eventId: any
  startDate: any
  endDate: any
  math = Math
  tableData: any = [];
  isLoader: boolean = false
  @ViewChild(DataTableDirective, { static: false })
  dataTableDirective!: DataTableDirective
  filterForm: any
  ngOnInit(): void {

    this.initializeDataTable();
  }

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute, private router:Router) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('eventId');
      this.eventId = id;

      const start = params.get('startDate');
      const end = params.get('endDate');

      this.startDate = this.formatDate(start);
      this.endDate = this.formatDate(end);
    });
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
          endDate: this.endDate,
          startDate: this.startDate,
          eventId: this.eventId
        }
        that.http.post<any>(CONFIG.getRoundRange, payload).subscribe((resp: any) => {
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

  navigateToHistory(roundNo: any, eventId: any) {
    this.router.navigateByUrl(`/user-bet-history/${eventId}/${roundNo}`)
  }


}
