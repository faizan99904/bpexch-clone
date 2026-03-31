import { Component } from '@angular/core';
import { HeaderComponent } from '../../Shared/header/header.component';
import { SidebarComponent } from '../../Shared/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { ToggleService } from '../../Services/toggle.service';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../Shared/footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent,SidebarComponent,RouterOutlet,CommonModule,FooterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
isOpen: boolean = false;
slimSidebar: boolean = false;

constructor(private toggle: ToggleService) {}

ngOnInit(): void {
  this.toggle.getSidebarState().subscribe((state: boolean) => {
    this.isOpen = state;
  });
  this.toggle.slimSidebar$.subscribe((state) => {
    this.slimSidebar = state;
  });
}

}
