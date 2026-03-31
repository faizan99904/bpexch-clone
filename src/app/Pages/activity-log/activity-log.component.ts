import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CONFIG } from '../../../../config';

@Component({
  selector: 'app-activity-log',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-log.component.html',
  styleUrl: './activity-log.component.css'
})
export class ActivityLogComponent implements OnInit {
  activityLogsList: any = []

  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {
    this.getActivities()
  }

  getActivities() {
    this.http.post(CONFIG.activityLog, {}).subscribe({
      next: (res: any) => {
        this.activityLogsList = res.data
      },
      error: (error) => {
        console.log('error', error);
      }
    })
  }
}
