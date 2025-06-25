import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit{
 userId!: number;

  user: any = {};
  testHistory: any[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('id')!;

    // Mock user data by ID
    const mockUsers: any = {
      1: {
        user: { name: 'John Doe', email: 'john@example.com', country: 'USA' },
        history: [
          { testName: 'Java Basics', takenAt: '2025-06-01 09:00 AM', score: '75%' },
          { testName: 'Data Structures', takenAt: '2025-06-05 11:30 AM', score: '88%' }
        ]
      },
      2: {
        user: { name: 'Priya Singh', email: 'priya@example.com', country: 'India' },
        history: [
          { testName: 'Aptitude', takenAt: '2025-06-02 10:30 AM', score: '90%' },
          { testName: 'English Grammar', takenAt: '2025-06-07 01:00 PM', score: '94%' }
        ]
      },
      3: {
        user: { name: 'Ravi Kumar', email: 'ravi@example.com', country: 'India' },
        history: [
          { testName: 'Reasoning', takenAt: '2025-06-03 02:00 PM', score: '82%' }
        ]
      }
    };

    const selected = mockUsers[this.userId];
    if (selected) {
      this.user = selected.user;
      this.testHistory = selected.history;
    } else {
      this.user = { name: 'Unknown', email: '-', country: '-' };
      this.testHistory = [];
    }
  }
}
