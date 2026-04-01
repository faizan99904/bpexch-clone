import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToggleService } from '../../Services/toggle.service';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isOpen: boolean = false;
  slimSidebar: boolean = false;
  sidebarItems: any[] = [];

  constructor(
    private router: Router,
    private toggle: ToggleService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.toggle.getSidebarState().subscribe((state: boolean) => {
      this.isOpen = state;
    });

    this.toggle.slimSidebar$.subscribe((state) => {
      this.slimSidebar = state;
    });

    this.initializeSidebarItems();
  }

  initializeSidebarItems(): void {
    const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
    const userRole = userDetails?.role;

    const allItems = [
      { img: '/assets/sidebar/meter.svg', heading: 'Dashboard', link: '/dashboard' },
      { img: '/assets/sidebar/d_w.webp', heading: 'Deposit/Withdraw', link: '/deposit-withdraw' },
      { img: '/assets/sidebar/money-check.svg', heading: 'Reports', link: '/profit-loss' },
      { img: '/assets/sidebar/fa-user.svg', heading: 'Users', link: '/users' },
      { img: '/assets/sidebar/deleteuser.svg', heading: 'Deleted Users', link: '/deleted-users' },
      { img: '/assets/sidebar/transactions.png', heading: 'Transaction Details', link: '/transaction-details' },
      { img: '/assets/sidebar/rounds.png', heading: 'Rounds', link: '/rounds' },
      { img: '/assets/sidebar/bet.png', heading: 'Bets', link: '/bets' },
      { img: '/assets/sidebar/banks.png', heading: 'Banks', link: '/banks' },
      { img: '/assets/sidebar/banks.png', heading: 'Banner', link: '/banner', visible: this.authService.hasRole('SUPER') || userRole === 'OPERATOR_ADMIN' },
      { img: '/assets/sidebar/banks.png', heading: 'Event', link: '/event', visible: this.authService.hasRole('SUPER') },
      { img: '/assets/sidebar/banks.png', heading: 'Event', link: '/operator-event', visible: this.authService.hasRole('OPERATOR_ADMIN') },
      { img: '/assets/sidebar/banks.png', heading: 'Customer Support', link: '/customer-support' },
    ];

    if (userRole === 'OPERATOR_ADMIN') {
      this.sidebarItems = allItems.filter(item =>
        ['/dashboard', '/profit-loss', '/operator-event', '/banner'].includes(item.link)
      );
    } else {
      this.sidebarItems = allItems.filter(item => item.visible !== false);
    }
  }

  isActive(item: any): boolean {
    return this.router.url === item.link;
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.toggle.setSidebarState(false);
    }
  }

  sidebarSlim(): void {
    this.slimSidebar = !this.slimSidebar;
    this.toggle.toggleSlimSidebar();
  }

  closeSidebar(): void {
    if (window.innerWidth < 768) {
      this.toggle.setSidebarState(false);
    }
  }
}