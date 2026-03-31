import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from "angular-datatables";
import { MyDatePickerModule } from "@murbanczyk-fp/mydatepicker";
import { NgForOf, NgIf } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { CONFIG } from "../../../../config";
import { RouterLink } from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BackendService } from "../../Services/backend.service";
import { ToastrService } from "ngx-toastr";


interface Bank {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  IBAN: string;
}



@Component({
  selector: 'app-banks',
  standalone: true,
  imports: [
    DataTablesModule,
    MyDatePickerModule,
    NgForOf,
    NgIf,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './banks.component.html',
  styleUrl: './banks.component.css'
})
export class BanksComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dataTableElement!: DataTableDirective;
  // @ts-ignore
  dtOptions: DataTables.Settings = {};
  imageFile: File | null = null;
  imagePreview: string | null = null;
  banks: any[] = [];
  dataTableParam: any;
  isModalOpen: boolean = false;
  bankForm!: FormGroup;
  isEditMode: boolean = false;
  userId: string = '';
  originalBankData: Bank = { bankName: '', accountNumber: '', accountHolderName: '', IBAN: '' };

  constructor(private http: HttpClient, private fb: FormBuilder, private backend: BackendService, private toastr: ToastrService) {
    this.bankForm = this.fb.group({
      bankName: ['', Validators.required],
      accountNumber: ['', Validators.required],
      accountHolderName: ['', Validators.required],
      IBAN: ['', Validators.required],
      maxAmount: [''],
      limits: [''],
      status: [''],
      image: [''],
    });
  }

  ngOnInit(): void {
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
      order: [0, "desc"],
      ajax: (dataTablesParameters: any, callback: any) => {
        that.http.post<any>(CONFIG.getBankDetails, Object.assign(dataTablesParameters, {})).subscribe((resp) => {
          let data = resp.data.data;
          this.dataTableParam = dataTablesParameters
          this.banks = data || [];
          callback({
            recordsTotal: resp.data.recordsTotal,
            recordsFiltered: resp.data.recordsFiltered,
            data: [],
          });
        })
      }
    };
  }

  openModal(editMode = false, bankData: any = null): void {
    this.isEditMode = editMode;
    this.userId = editMode ? bankData._id : '';
    this.bankForm.reset();

    if (editMode) {
      this.bankForm.patchValue({
        ...bankData,
        maxAmount: bankData.maxAmount || '',
        limits: bankData.limits || '',
        status: bankData.status || 'active',
      });

      // Set existing image preview
      this.imagePreview = bankData.image ? bankData.image : null;
    } else {
      this.imagePreview = null;
    }

    this.originalBankData = { ...bankData };
    this.isModalOpen = true;
  }



  closeModal(): void {
    this.isModalOpen = false;
    this.bankForm.reset();
  }

  onSubmit(): void {
    if (this.bankForm.valid) {
      const payload = this.bankForm.value;

      const formData = new FormData();
      Object.keys(payload).forEach(key => {
        if (payload[key] !== null && payload[key] !== undefined) {
          formData.append(key, payload[key]);
        }
      });

      if (this.imageFile) {
        formData.append('image', this.imageFile);
      }

      const request$ = this.isEditMode
        ? this.backend.updateBankDetails(this.userId, formData)
        : this.backend.addBank(formData);

      request$.subscribe(
        () => {
          this.toastr.success(this.isEditMode ? 'Bank updated successfully.' : 'Bank added successfully.');
          this.closeModal();
          this.dataTableElement.dtInstance.then(dt => dt.ajax.reload());
        },
        () => this.toastr.error('Error while saving bank details.')
      );
    }
  }


  getUpdatedFields(newData: Bank): Partial<Bank> {
    const updatedFields: Partial<Bank> = {};
    Object.keys(newData).forEach((key) => {
      if (newData[key as keyof Bank] !== this.originalBankData[key as keyof Bank]) {
        updatedFields[key as keyof Bank] = newData[key as keyof Bank];
      }
    });
    return updatedFields;
  }

  onImageSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  render(): void {
    this.dataTableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    }).catch(error => {
      console.error('Error reloading table:', error);
      this.initializeDataTable();
    });
  }


  confirmDelete(bankId: any) {
    const payload = {
      bankId: bankId
    };

    this.http.delete(CONFIG.deleteBank, { body: payload }).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message);
        console.log("deleted successfully");
        this.render()
      },
      error: (error) => {
        this.toastr.error(error.message);
      }
    });
  }




}
