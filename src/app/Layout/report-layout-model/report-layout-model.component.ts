import { Component } from '@angular/core';
import { HeaderComponent } from "../../Shared/header/header.component";
import { SidebarComponent } from "../../Shared/sidebar/sidebar.component";
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToggleService } from '../../Services/toggle.service';
import { AccountsComponent } from '../../Pages/accounts/accounts.component';
interface reportBtnContent {
  title: string,
  routerLink: string
}
@Component({
  selector: 'app-report-layout-model',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, RouterOutlet, CommonModule, RouterLink, AccountsComponent],
  templateUrl: './report-layout-model.component.html',
  styleUrl: './report-layout-model.component.css'
})
export class ReportLayoutModelComponent {

  isOpen: boolean = false;
  slimSidebar: boolean = false;

  constructor(private toggle: ToggleService) { }

  ngOnInit(): void {
    this.toggle.getSidebarState().subscribe((state: boolean) => {
      this.isOpen = state;
    });

  this.toggle.slimSidebar$.subscribe((state) => {
    this.slimSidebar = state;
  });

  this.isActiveNumber = this.reportBtnContent.findIndex(item => item.title === 'Accounts');
  }

  isActiveNumber!: number
  reportBtnContent: reportBtnContent[] = [
    {
      title: 'Daily PL',
      routerLink: '/Reports/DailyPl'
    },
    {
      title: 'Daily Report',
      routerLink: '/Reports/Daily'
    },
    {
      title: 'Accounts',
      routerLink: '/Reports/accounts'

    },
    {
      title: 'Commission Report',
      routerLink: '/Reports/commision'
    }
  ]
  isActive(index: number) {
    this.isActiveNumber = index
  }



}
