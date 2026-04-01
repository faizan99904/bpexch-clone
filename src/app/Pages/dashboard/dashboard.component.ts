import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BackendService } from "../../Services/backend.service";
import { DecimalFormatPipe } from "../../Pipes/decimal-format.pipe";
import { log } from 'node:console';
import { AuthService } from '../../Services/auth.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'

})
export class DashboardComponent implements OnInit {
  isMaintenance: any
  errorMessage: string = '';
  Status: boolean | null = null;
  UpdateStatusUi:any
  maintenanceData: any = []
  cards = [
    { title: 'New Clients', key: 'newClients', count: 0 },
    { title: 'Total Users', key: 'totalClients', count: 0 },
    { title: 'Total Bets', key: 'totalBets', count: 0 },
    { title: 'Total Stakes', key: 'totalStakes', count: 0 },
    { title: 'Total Cashout Amount', key: 'totalCashoutAmount', count: 0 },
    { title: 'Total Profit/Loss', key: 'totalPl', count: 0 }
  ];



  constructor(private backend: BackendService, private authService: AuthService, private toastr:ToastrService) { }

  ngOnInit(): void {
    this.Avitor()
    this.fetchStats();
  }

  isSuperUser(): boolean {
    return this.authService.hasRole('SUPER');
  }

  fetchStats() {
    return
    this.backend.getAllStats().subscribe(
      (response) => {
        if (response.status === 'success') {
          const data = response.data;
          this.cards.forEach(card => {
            if (card.key === 'totalStakes' || card.key === 'totalCashoutAmount') {
              card.count = data[card.key]?.['$numberDecimal'] || 0; // Extract $numberDecimal
            } else {
              card.count = data[card.key] || 0;
            }
          });
        }
      },
      (error) => {
        console.error('Error fetching stats:', error);
      }
    );
  }

  Avitor() {
    if(this.isSuperUser()){
      this.backend.maintenance().subscribe({
        next: (res: any) => {
          this.maintenanceData = [res.data]
          this.isMaintenance = res.data.isMaintenance
        },
  
        error: (err) => {
          console.log(err);
        },
      })
    }
   
  }

  onStatusChange(value: string | null): void {
    this.Status = value === null ? null : value === "true";
  }

  UpdateStatus(){
    this.UpdateStatusUi = this.Status
    const req = {
      isMaintenance: this.Status,
    }

    this.backend.maintenancePost(req).subscribe({
      next: (res) => {
        this.toastr.success(res.message, 'Success');
      },

      error: (err)=>{
        this.errorMessage = err.error.message || 'Failed Update';
        this.toastr.error(this.errorMessage, 'Failed Update');
      }

    })
  }

  getInteger(value: number): number {
    return Math.floor(value);
  }
}
