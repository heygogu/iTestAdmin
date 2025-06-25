import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  constructor(private router: Router) {}

  searchQuery = '';

  users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      quizName: 'General Knowledge',
      attemptDate: '2025-06-22',
      totalScore: 100,
      scoreObtained: 85,
      status: 'Pass'
    },
    {
      id: 2,
      name: 'Priya Singh',
      email: 'priya@example.com',
      quizName: 'Science & Tech',
      attemptDate: '2025-06-20',
      totalScore: 100,
      scoreObtained: 65,
      status: 'Pass'
    },
    {
      id: 3,
      name: 'Ravi Kumar',
      email: 'ravi@example.com',
      quizName: 'Mathematics',
      attemptDate: '2025-06-19',
      totalScore: 100,
      scoreObtained: 40,
      status: 'Fail'
    }
  ];

  get filteredUsers() {
    return this.users.filter(user =>
      user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  viewDetails(id: number) {
    this.router.navigate(['/user-details', id]);
  }
}
