import {Component, OnInit} from '@angular/core';
import {BackendService} from "../../Services/backend.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-deleted-users',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './deleted-users.component.html',
  styleUrl: './deleted-users.component.css'
})
export class DeletedUsersComponent implements OnInit{

  deletedUsers: any[] = [];

  constructor(private backend:BackendService,private toastr:ToastrService) {
  }


  ngOnInit() :void {
    this.fetchDeletedUsers();

  }

  fetchDeletedUsers(): void {
    this.backend.getAllDeletedUsersList().subscribe({
      next: (response) => {
        this.deletedUsers = response.data;
      },
      error: (err) => {
        this.toastr.error('Error fetching deleted users', 'Error');
        console.error('Error fetching deleted users:', err);
      }
    });
  }

  restoreUser(userId: string): void {
    this.backend.restoreUser(userId).subscribe({
      next: (response) => {
        this.toastr.success(response.message || 'User restored successfully!', 'Success');
        this.fetchDeletedUsers();
      },
      error: (err) => {
        this.toastr.error(err.error.message || 'Error restoring user', 'Error');  // Show error message
        console.error('Error restoring user:', err);
      }
    });
  }

}
