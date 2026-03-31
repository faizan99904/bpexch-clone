import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AuthService} from "./Services/auth.service";
import { NgxLoadingModule } from 'ngx-loading';
import { NgxLoadingService } from './Services/ngx-loading.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,NgxLoadingModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'admin panel';

  public isLoading$ = this.loadingService.loading$;


  constructor(private authService:AuthService,public loadingService: NgxLoadingService) {
  }

  ngOnInit() {
    this.authService.fetchWalletBalance();
  }


}
