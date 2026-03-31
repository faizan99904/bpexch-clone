import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  Dropdown,
  Ripple,
  initTWE,
} from "tw-elements";
import { ToggleService } from '../../Services/toggle.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LoginPageComponent } from '../../Pages/login-page/login-page.component';
import {AuthService} from "../../Services/auth.service";
import {WalletService} from "../../Services/wallet.service";
import { ChangePasswordComponent } from '../../modal/change-password/change-password.component';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, LoginPageComponent, ChangePasswordComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  isMobile : boolean  =false;
  isTablet : boolean  =false;
  isDesktop : boolean = false;
  sidebarState: boolean = false;
  userName: string = '';
  userRole: string = '';
  walletBalance: number | null = null;
  exposure: number | null = null;
  showChangePasswordModal = false;

  constructor(
    private toggle: ToggleService,
    private deviceDetector: DeviceDetectorService,
    private authService: AuthService,
    private walletService: WalletService
  ) {
   this.isMobile = this.deviceDetector.isMobile();
   this.isTablet = this.deviceDetector.isTablet();
   this.isDesktop = this.deviceDetector.isDesktop();
  }

  ngOnInit():void {
    this.walletService.walletBalance$.subscribe(balance => this.walletBalance = balance);
    this.walletService.exposure$.subscribe(exposure => this.exposure = exposure);
    const user = this.authService.getUserDetails();

    if (user) {
      this.userName = this.capitalizeFirstLetter(user.username);
      this.userRole = user.role.toLowerCase();
    }

    this.getSidebarState()
    initTWE({ Dropdown,Ripple });
  }



  getSidebarState(){
    this.toggle.getSidebarState().subscribe((val:boolean)=>{
      this.sidebarState = val
    })
    // Setting state base on device size
    if(this.isDesktop){
      this.toggle.setSidebarState(true)
    } else if(this.isMobile) {
      this.toggle.setSidebarState(false)
    } else if(this.isTablet) {
      this.toggle.setSidebarState(false)
    }
  }


  toggleSidebar() {
    this.toggle.setSidebarState(!this.sidebarState)
  }


  logout() {
    this.authService.logout();
  }

  capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  openChangePasswordModal() {
    this.showChangePasswordModal = true;
  }

  closeChangePasswordModal() {
    this.showChangePasswordModal = false;
  }
}
