import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AppToasterService } from '../services/toaster.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-schedule-quiz',
  templateUrl: './schedule-quiz.component.html',
  styleUrls: ['./schedule-quiz.component.css']
})
export class ScheduleQuizComponent implements OnInit {
  quizzes: any[] = [];
  categories: any[] = [];
  currentPage = 1;
  totalPages = 1;
  pageSize = 6;
  selectedCategory: number | null = null;
  searchText = '';

  constructor(
    private api: ApiService,
    private toast: AppToasterService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.currentPage = parseInt(params.get('page') || '1', 10);
      this.loadCategories();
      this.loadQuizzes();
    });
  }


  loadCategories(): void {
    this.api.admin.getCategoryStats().pipe(
      tap(res => {
        if (res.success) this.categories = res.data;
      }),
      catchError(() => of(null))
    ).subscribe();
  }

  loadQuizzes(): void {
    this.api.admin.getUnscheduledQuizzes(this.currentPage, this.pageSize, this.selectedCategory, this.searchText).pipe(
      tap(res => {
        if (res?.success && res.data?.quizzes) {
          this.quizzes = res.data.quizzes;
          const total = res.data.totalCount || 0;
          this.totalPages = total > 0 ? Math.ceil(total / (res.data.limit || this.pageSize)) : 1;
        } else {
          this.quizzes = [];
        }
      }),
      catchError((err) => {
        this.toast.error(err.error.message);
        return of(null);
      })
    ).subscribe();
  }


  scheduleQuiz(quizId: number, date: string): void {
    if (!date) {
      this.toast.warning('Please select a date.');
      return;
    }

    this.api.admin.scheduleQuizById(quizId, new Date(date).toISOString()).pipe(
      tap(() => {
        this.toast.success('Quiz scheduled!');
        this.loadQuizzes();
      }),
      catchError((err) => {
        this.toast.error(err.error.message);
        return of(null);
      })
    ).subscribe();
  }

  deleteQuiz(quizId: number): void {
    this.api.admin.deleteQuizById(quizId).pipe(
      tap(() => {
        this.toast.success('Quiz deleted!');
        this.loadQuizzes();
      }),
      catchError((err) => {
        this.toast.error(err?.error?.message);
        return of(null);
      })
    ).subscribe();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.router.navigate(['/schedule-quiz/page', this.currentPage + 1]);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.router.navigate(['/schedule-quiz/page', this.currentPage - 1]);
    }
  }

}
