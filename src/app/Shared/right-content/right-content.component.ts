import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BetListComponent } from '../../Pages/bet-list/bet-list.component';

@Component({
  selector: 'app-right-content',
  standalone: true,
  imports: [RouterLink,BetListComponent],
  templateUrl: './right-content.component.html',
  styleUrl: './right-content.component.css'
})
export class RightContentComponent {

}
