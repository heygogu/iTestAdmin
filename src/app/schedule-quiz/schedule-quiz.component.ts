import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { ToastServiceService } from 'src/app/toast-service.service';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

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
    private toast: ToastServiceService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadQuizzes();
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
      catchError(() => {
        this.toast.show('Failed to load quizzes.');
        return of(null);
      })
    ).subscribe();
  }


  scheduleQuiz(quizId: number, date: string): void {
    if (!date) {
      this.toast.show('Please select a date.');
      return;
    }

    this.api.admin.scheduleQuizById(quizId, new Date(date).toISOString()).pipe(
      tap(() => {
        this.toast.show('Quiz scheduled!');
        this.loadQuizzes();
      }),
      catchError(() => {
        this.toast.show('Failed to schedule quiz.');
        return of(null);
      })
    ).subscribe();
  }

  deleteQuiz(quizId: number): void {
    this.api.admin.deleteQuizById(quizId).pipe(
      tap(() => {
        this.toast.show('Quiz deleted!');
        this.loadQuizzes();
      }),
      catchError(() => {
        this.toast.show('Failed to delete quiz.');
        return of(null);
      })
    ).subscribe();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadQuizzes();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadQuizzes();
    }
  }
}
