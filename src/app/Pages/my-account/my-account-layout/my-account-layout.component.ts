
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-my-account-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './my-account-layout.component.html',
  styleUrl: './my-account-layout.component.css'
})
export class MyAccountLayoutComponent implements OnInit {
  userId: string = '';
  role: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.firstChild?.paramMap.subscribe(params => {
      this.userId = params.get('userId') ?? '';
      this.role = params.get('role') ?? '';
    });
  }

}
