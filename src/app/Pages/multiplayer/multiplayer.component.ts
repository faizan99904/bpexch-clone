import { Component, OnInit } from '@angular/core';
import { BackendService } from "../../Services/backend.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {AuthService} from "../../Services/auth.service";

@Component({
  selector: 'app-multiplayer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './multiplayer.component.html',
  styleUrls: ['./multiplayer.component.css']
})
export class MultiplayerComponent implements OnInit {
  multiplayer: any[] = [];
  showModal = false;
  multiplayerSettings = { min: '', max: '', probability: '' };

  constructor(private backendService: BackendService,private authService:AuthService) {}

  ngOnInit(): void {
    if (this.authService.hasRole('SUPER')) {
      this.loadMultiplayerData();
    }
  }

  submitMultiplayer(): void {
    if (!this.authService.hasRole('SUPER')) {
      console.error('Unauthorized: Only users with the role super can perform this action.');
      return;
    }
    if (Object.values(this.multiplayerSettings).some(v => v === '')) {
      console.error('All fields must be filled');
      return;
    }
    this.backendService.addMultiplayer({ ...this.multiplayerSettings }).subscribe({
      next: response => {
        console.log('Multiplayer settings updated:', response);
        this.toggleModal(false);
        this.loadMultiplayerData();
      },
      error: error => console.error('Failed to update multiplayer settings:', error)
    });
  }
  onDeleteMultiplier(multiplierId: string): void {
    this.backendService.deleteMultiplier(multiplierId).subscribe({
      next: (response) => {
        console.log('Multiplier deleted successfully',response);
        this.loadMultiplayerData();
      },
      error: (error) => {
        console.error('Error deleting multiplier:', error);
      }
    });
  }

  loadMultiplayerData(): void {
    this.backendService.getMultiplayer().subscribe({
      next: response => this.multiplayer = response.data,
      error: error => console.error('Error fetching multiplayer data:', error)
    });
  }

  toggleModal(show: boolean): void {
    this.showModal = show;
  }
}
