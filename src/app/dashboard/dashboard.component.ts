import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { AppToasterService } from '../services/toaster.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

constructor(
  private router: Router,
  private api: ApiService,
  private toast: AppToasterService
) {}

  recentResults: any[] = [];
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  ngOnInit(): void {
    this.loadRecentUsers();
  }

  loadRecentUsers(): void {
    this.api.user.getRecentUsers(this.currentPage, this.pageSize).pipe(
      tap((res) => {
        if (res.success) {
          this.recentResults = res.data.map(row => ({
            name: row.userName,
            quiz: row.quizTitle,
            score: `${row.score} / ${row.totalMarks}`,
            id: row.userId,
            passed: row.passed
          }));
          this.totalPages = Math.ceil(res.total / res.limit);
        }
      }),
      catchError((err) => {
        this.toast.error('Failed to load recent users');
        return of(null);
      })
    ).subscribe();
  }

  goToUserDetails(userId: number): void {
    this.router.navigate(['/user-details', userId]);
  }

}
