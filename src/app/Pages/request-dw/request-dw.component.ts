import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from "angular-datatables";
import { IMyDpOptions, MyDatePickerModule } from "@murbanczyk-fp/mydatepicker";
import { CommonModule } from "@angular/common";
import { DateService } from "../../Services/data.service";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { CONFIG } from "../../../../config";
import { FormsModule } from "@angular/forms";
import { BackendService } from "../../Services/backend.service";
import { ToastrService } from "ngx-toastr";
import { WalletService } from '../../Services/wallet.service';

@Component({
  selector: 'app-request-dw',
  standalone: true,
  imports: [
    MyDatePickerModule, FormsModule, DataTablesModule, CommonModule
  ],
  templateUrl: './request-dw.component.html',
  styleUrl: './request-dw.component.css'
})
export class RequestDwComponent implements OnInit, OnDestroy {

  userId!: string;
  selectedType: string = 'all';
  selectedStatus: string = 'all';
  isReceiptModalVisible = false;
  selectedReceiptUrl = '';
  isBankModalVisible = false;
  selectedBank: any = null;
  isConfirmationModalVisible = false;
  confirmStatus: string = '';
  selectedReqId: string = '';
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
  autoRefresh = false;
  autoRefreshInterval: any;

  constructor(private dateService: DateService, private http: HttpClient, private route: ActivatedRoute, private backend: BackendService, private toastr: ToastrService, private walletService: WalletService) {
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
  ngOnDestroy(): void {
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
    }
  }
  toggleAutoRefresh(): void {
    if (this.autoRefresh) {
      this.autoRefreshInterval = setInterval(() => {
        this.refreshData();
      }, 10000);
    } else {
      if (this.autoRefreshInterval) {
        clearInterval(this.autoRefreshInterval);
        this.autoRefreshInterval = null;
      }
    }
  }

  refreshData(): void {
    this.formattedStartDate = this.dateService.getStartDate(this.startDate.date);
    this.formattedEndDate = this.dateService.getEndDate(this.endDate.date);
    // @ts-ignore
    this.dataTableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
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
      order: [1, "desc"],
      ajax: (dataTablesParameters: any, callback: any) => {
        const requestPayload = Object.assign(dataTablesParameters, {
          startDate: this.formattedStartDate,
          endDate: this.formattedEndDate,
          type: this.selectedType,
          status: this.selectedStatus,
        });

        if (this.userId) {
          requestPayload.userId = this.userId;
        }

        that.http.post<any>(CONFIG.requestDW, requestPayload).subscribe((resp) => {
          let data = resp.data.data;
          this.dataTableParam = dataTablesParameters;
          if (!Array.isArray(data) || data.length === 0) {
            this.transactions = [];
          } else {
            this.transactions = data;
          }
          callback({
            recordsTotal: resp.data.recordsTotal,
            recordsFiltered: resp.data.recordsFiltered,
            data: [],
          });
        });
      }
    };
  }

  showReceipt(receiptUrl: string): void {
    this.selectedReceiptUrl = receiptUrl || '';
    this.isReceiptModalVisible = true;
  }

  showBankDetails(bank: any): void {
    this.selectedBank = bank;
    this.isBankModalVisible = true;
  }

  closeModal(): void {
    this.isReceiptModalVisible = false;
    this.isBankModalVisible = false;
    this.isConfirmationModalVisible = false;
    this.selectedReceiptUrl = '';
    this.selectedBank = null;
    this.confirmStatus = '';
  }

  onFilterChange(): void {
    this.submitDate();
    this.transactions = [];
  }

  onStatusChange(transaction: any, newStatus: string): void {
    if (newStatus === 'success') {
      this.confirmStatus = newStatus;
      this.selectedReqId = transaction._id;
      this.isConfirmationModalVisible = true;
    } else {
      this.updateStatus(transaction._id, newStatus);
    }
  }
  confirmUpdate(): void {
    this.updateStatus(this.selectedReqId, this.confirmStatus);
    this.closeModal();
  }

  updateStatus(reqId: string, status: string): void {
    const payload = { status, reqId };
    this.backend.updateRequestDwStatus(payload).subscribe({
      next: (response: any) => {
        this.toastr.success(response.message);
        this.getWalletBalance()
      },
      error: ((error) => {
        this.toastr.error(error.error.message);
      })
    })
  }

  copyToClipboard(text: string | undefined): void {
    console.log("clicked")

    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        this.toastr.success('Copied to clipboard!');
      }).catch(err => {
        this.toastr.error('Failed to copy to clipboard. Please try again.');
        console.error('Could not copy text: ', err);
      });
    } else {
      this.toastr.warning('Nothing to copy.');
    }
  }


  submitDate() {
    this.formattedStartDate = this.dateService.getStartDate(this.startDate.date);
    this.formattedEndDate = this.dateService.getEndDate(this.endDate.date);
    this.transactions = [];
    // @ts-ignore
    this.dataTableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();

    });
  }


  getWalletBalance() {
    this.backend.getWalletBalance().subscribe({
      next: ((res: any) => {
        this.walletService.setWalletBalance(res.data.balance)
      })
    })
  }



}
