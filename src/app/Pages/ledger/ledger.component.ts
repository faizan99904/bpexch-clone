import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CONFIG } from '../../../../config';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ledger',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ledger.component.html',
  styleUrl: './ledger.component.css'
})
export class LedgerComponent {
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
