import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { DepositWithdrawComponent } from "../../../modal/deposit-withdraw/deposit-withdraw.component";
import { HttpClient } from "@angular/common/http";
import { CONFIG } from "../../../../../config";
import { BackendService } from "../../../Services/backend.service";
import { ToastrService } from "ngx-toastr";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DecimalFormatterPipe } from "../../../Pipes/decimal-formatter.pipe";



@Component({
  selector: 'app-all-user-detail',
  standalone: true,
  imports: [DataTablesModule, CommonModule, RouterLink, DepositWithdrawComponent, ReactiveFormsModule, DecimalFormatterPipe],
  templateUrl: './all-user-detail.component.html',
  styleUrls: ['./all-user-detail.component.css'],
})
export class AllUserDetailComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dataTableElement!: DataTableDirective;
  // @ts-ignore
  dtOptions: DataTables.Settings = {};
  users: any[] = [];
  selectedUser: any = null;
  userId: any
  showModal = false;
  modalType: 'deposit' | 'delete' | 'changePassword' | null = null;
  dataTableParam: any;
  changePasswordForm: FormGroup;
  persons: any[] = [
    { id: 1, firstName: "John", lastName: "Doe", action: "deposit" },
    { id: 2, firstName: "Jane", lastName: "Smith", action: "withdraw" },
    { id: 3, firstName: "Alice", lastName: "Johnson", action: "toggle" },
    { id: 4, firstName: "Bob", lastName: "Brown", action: "delete" },
  ];
  currentUserId: string | null = null;


  constructor(private http: HttpClient, private backend: BackendService, private toastr: ToastrService, private router: Router, private fb: FormBuilder, private route: ActivatedRoute) {
    this.changePasswordForm = this.fb.group({
      parentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
    });

    this.route.queryParams.subscribe((params: any) => {
      this.userId = params['userId'];
      console.log('User ID:', this.userId);
    });
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'] || null;
      this.currentUserId = this.userId;
      if (this.dataTableElement) {
        this.onRefreshTable();
      }
    });
    this.initializeDataTable()
  }

  initializeDataTable(): void {
    if (this.userId) {
      this.currentUserId = this.userId
    }

    const that = this
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      searching: true,
      autoWidth: false,
      processing: false,
      order: [10, "desc"],
      columns: [
        { data: "username", name: "", searchable: true, orderable: true },
        { data: "name", name: "", searchable: true, orderable: true },
        { data: "role", name: "", searchable: true, orderable: true },
        { data: "isDemo", name: "", searchable: true, orderable: true },
        { data: "balance", name: "", searchable: false, orderable: true },
        { data: "exposure", name: "", searchable: false, orderable: true },
        { data: "status", name: "", searchable: false, orderable: true },
        { data: "currency", name: "", searchable: false, orderable: true },
        { data: "downlineBalance", name: "", searchable: false, orderable: true },
        { data: "availableBalance", name: "", searchable: false, orderable: true },
        { data: "createdAt", name: "", searchable: false, orderable: true },
      ],

      ajax: (dataTablesParameters: any, callback: any) => {
        dataTablesParameters.userId = this.currentUserId;

        that.http.post<any>(CONFIG.getUser, Object.assign(dataTablesParameters, {})).subscribe((resp) => {
          let data = resp.data.data;
          this.dataTableParam = dataTablesParameters
          if (data && Array.isArray(data)) {
            this.users = data;
          }
          callback({
            recordsTotal: resp.data.recordsTotal,
            recordsFiltered: resp.data.recordsFiltered,
            data: [],
          });

        });
      },
    };
  }

  onClickUsername(userId: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { userId },
      queryParamsHandling: 'merge',
    });
    this.onRefreshTable();

  }


  confirmDelete(): void {
    if (this.selectedUser) {
      this.backend.deleteUser(this.selectedUser._id).subscribe(
        (response) => {
          this.toastr.success(response.message || 'User deleted successfully!', 'Success');
          this.rerender();
          this.closeModal();
        },
        (error) => {
          this.toastr.error(error?.error?.message || 'Failed to delete user. Please try again.', 'Error');
          this.closeModal();
        }
      );
    }
  }



  onOpenModal(person: any, type: 'deposit' | 'delete' | 'changePassword'): void {
    this.selectedUser = person;
    this.showModal = true;
    this.modalType = type;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedUser = null;
    this.modalType = null;
  }

  onRefreshTable(): void {
    this.rerender();
  }

  onChangePassword(): void {
    if (this.changePasswordForm.valid) {
      const payload = {
        userId: this.selectedUser._id,
        parentPassword: this.changePasswordForm.get('parentPassword')?.value,
        newPassword: this.changePasswordForm.get('newPassword')?.value,
      };

      this.backend.changePassword(payload).subscribe({
        next: (res) => {
          this.toastr.success(res.message || 'Password changed successfully!', 'Success');
          this.changePasswordForm.reset();
          this.closeModal();
        },
        error: (err) => {
          this.toastr.error('Error changing password', err);
        }
      });
    }
  }


  editUser(person: any): void {
    console.log('Navigating to Edit User Page with User Data:', person); // DEBUG: Check if person data is correct
    this.router.navigate(['/new-user', person._id], { state: { userData: person } });
  }

  rerender(): void {
    // @ts-ignore
    this.dataTableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }


}
