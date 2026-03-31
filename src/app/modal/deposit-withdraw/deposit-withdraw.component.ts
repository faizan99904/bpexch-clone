import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BackendService } from '../../Services/backend.service';
import { DecimalPipe, NgIf } from "@angular/common";
import { WalletService } from '../../Services/wallet.service';

@Component({
  selector: 'app-deposit-withdraw',
  templateUrl: './deposit-withdraw.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    DecimalPipe
  ],
  styleUrls: ['./deposit-withdraw.component.css']
})
export class DepositWithdrawComponent implements OnInit {

  @Input() userId: string = '';
  @Input() userName: string = '';
  @Input() clientBalance: number | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() refreshTable = new EventEmitter<void>();

  depositForm!: FormGroup;
  isDepositLoading: boolean = false;
  isWithdrawLoading: boolean = false;


  constructor(
    private backend: BackendService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private walletService: WalletService
  ) { }

  ngOnInit(): void {
    this.depositForm = this.formBuilder.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      remarks: [''],
    });

  }

  handleTransaction(isDeposit: boolean) {
    if (this.depositForm.invalid) {
      this.toastr.warning('Please enter a valid amount', 'Warning');
      return;
    }

    const amount = this.depositForm.get('amount')?.value;
    const remarks = this.depositForm.get('remarks')?.value;

    if (isDeposit) {
      this.isDepositLoading = true;
    } else {
      this.isWithdrawLoading = true;
    }

    const transaction$ = isDeposit
      ? this.backend.depositAmount(this.userId, amount, remarks)
      : this.backend.withdrawAmount(this.userId, amount, remarks);

    transaction$.subscribe(
      response => {
        const successMessage = response.message || (isDeposit ? 'Deposit successful!' : 'Withdraw successful!');
        this.toastr.success(successMessage, 'Success');
        this.closeModal();
        this.refreshTable.emit();
        this.getWalletBalance();
      },
      error => {
        const errorMessage = error?.error?.message || (isDeposit ? 'Deposit failed. Please try again.' : 'Withdraw failed. Please try again.');
        this.toastr.error(errorMessage, 'Error');
      },
      () => {
        this.isDepositLoading = false;
        this.isWithdrawLoading = false;
      }
    );
  }


  // Call this for deposit
  onDeposit() {
    this.handleTransaction(true);
  }

  // Call this for withdraw
  onWithdraw() {
    this.handleTransaction(false);
  }

  // Close the modal
  closeModal() {
    this.close.emit();
  }

  getWalletBalance() {
    this.backend.getWalletBalance().subscribe({
      next: ((res: any) => {
        this.walletService.setWalletBalance(res.data.balance)
      })
    })
  }


}
