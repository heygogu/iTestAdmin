import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
constructor(private router: Router) {}

  recentResults = [
    { id: 1, name: 'John Doe', quiz: 'HTML Basics', score: 85 },
    { id: 2, name: 'Priya Singh', quiz: 'Angular Intro', score: 92 },
    { id: 3, name: 'Ravi Kumar', quiz: 'C# Fundamentals', score: 78 }
  ];

  goToUserDetails(userId: number) {
    this.router.navigate(['/user-details', userId]);
  }
}
