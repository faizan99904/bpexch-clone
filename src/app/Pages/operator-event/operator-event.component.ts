import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CONFIG } from '../../../../config';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-operator-event',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './operator-event.component.html',
  styleUrl: './operator-event.component.css'
})
export class OperatorEventComponent implements OnInit {
  operatorList: any
  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    this.getOperatorList()
  }
  getOperatorList() {
    this.http.post(CONFIG.adminOperator, {}).subscribe((data: any) => {
      this.operatorList = data?.data
    })
  }
}
