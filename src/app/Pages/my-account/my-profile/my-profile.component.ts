import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BackendService} from "../../../Services/backend.service";
import {CommonModule, TitleCasePipe} from "@angular/common";

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    TitleCasePipe,
    CommonModule
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit {
  userId: string = '';
  userProfile: any;
  userProfileArray: { title: string; value: any }[] = [];

  constructor(
    private route: ActivatedRoute,
    private backendService: BackendService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId') ?? '';
      if (this.userId) {
        this.fetchUserProfile(this.userId);
      } else {
        console.error('No user ID provided in route parameters.');
      }
    });
  }

  fetchUserProfile(userId: string): void {
    this.backendService.getUserProfile(userId).subscribe({
      next: (response) => {
        this.userProfile = response.data;


        const excludedKeys = ['_id', 'parent', 'createdAt', 'updatedAt', 'isLoggedIn'];
        this.userProfileArray = Object.entries(this.userProfile)
          .filter(([key]) => !excludedKeys.includes(key))
          .map(([key, value]) => ({ title: key, value }));
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
      },
    });
  }

}
