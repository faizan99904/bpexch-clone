import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { AllUserDetailComponent } from './all-user-detail/all-user-detail.component';
import {AuthService} from "../../Services/auth.service";

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, DataTablesModule, RouterLink, AllUserDetailComponent],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent implements OnInit, AfterViewInit {

  userName: string = '';
  dtOptions: Config = {};
  isLoad: boolean = false;

  ngAfterViewInit(): void {
    setTimeout(() => {
      const search = document.querySelector(".dt-search")
      const dtInFo = document.querySelector(".dt-info")
      dtInFo?.classList.add("invisible")
      search?.classList.add("invisible")
      search?.classList.add("max-h-0")
      dtInFo?.classList.add("max-h-0")

    }, 10);

  }

  constructor(private authService: AuthService,) {
  }



  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers'
    };

    const user = this.authService.getUserDetails();

    if(user){
      this.userName = user.username;
    }

  }

  @HostListener('wheel', ['$event'])
  onWheelEvent(event: WheelEvent) {
    // event.preventDefault();
    this.searchUser(event)
  }

  userSearchVal!: string
  searchUser(event: any) {


    this.userSearchVal = event.target.value

  }

  loadBlance() {
    this.isLoad = !this.isLoad
  }
}
