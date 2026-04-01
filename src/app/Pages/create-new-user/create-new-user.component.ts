import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BackendService } from '../../Services/backend.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-create-new-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-new-user.component.html',
  styleUrls: ['./create-new-user.component.css']
})
export class CreateNewUserComponent implements OnInit {
  userForm!: FormGroup;
  errorMessages: { [key: string]: string } = {};
  isEditMode: boolean = false;
  userId: string | null = null;
  showPassword: boolean = false;
  userDetails: any;

  constructor(
    private fb: FormBuilder,
    private backend: BackendService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.userId = this.route.snapshot.paramMap.get('id');

    if (this.userId) {
      this.isEditMode = true;
      const userData = history.state.userData;
      if (userData) {
        this.populateForm(userData);
      } else {
        console.error('No userData found in history state.');
      }
    }
  }

  private initializeForm(): void {
    this.userForm = this.fb.group({
      operatorName: ['', Validators.required],
      operatorCode: ['', Validators.required],
      domain: ['', Validators.required],
      walletBaseUrl: ['', Validators.required],
      walletApiKey: ['', Validators.required],
      walletSecret: ['', Validators.required],
      adminUsername: ['', Validators.required],
      adminPassword: ['', Validators.required],
      adminName: ['', Validators.required],
      adminEmail: ['', [Validators.required, Validators.email]],
      adminCurrency: ['', Validators.required]
    });
  }

  private populateForm(userData: any): void {
    this.userForm.patchValue(userData);
    this.cdr.detectChanges();
  }

  isSuperUser(): boolean {
    return this.authService.hasRole('SUPER');
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    const formValues = { ...this.userForm.value };

    // Convert adminUsername to lowercase
    if (formValues.adminUsername) {
      formValues.adminUsername = formValues.adminUsername.toLowerCase();
    }

    const payload = this.isEditMode ? this.getChangedFields() : formValues;

    const request$ = this.isEditMode
      ? this.backend.updateUser(this.userId!, payload)
      : this.backend.createUser(payload);

    request$.subscribe({
      next: (response) => {
        this.toastr.success(response.message || 'Operation successful!', 'Success');
        this.router.navigate(['users']);
        this.authService.fetchWalletBalance();
      },
      error: (errorResponse) => this.handleErrorResponse(errorResponse)
    });
  }

  private getChangedFields(): any {
    const changedFields: any = {};
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      if (control?.dirty) {
        changedFields[key] = control.value;
      }
    });
    return changedFields;
  }

  private handleErrorResponse(errorResponse: any): void {
    this.errorMessages = errorResponse.error?.errors || {};
    const message = errorResponse.error?.message || 'An error occurred.';
    this.toastr.error(message, 'Error');
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}