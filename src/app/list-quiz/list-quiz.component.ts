import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { ToastServiceService } from 'src/app/toast-service.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


@Component({
  selector: 'app-list-quiz',
  templateUrl: './list-quiz.component.html',
  styleUrls: ['./list-quiz.component.css']
})
export class ListQuizComponent implements OnInit {
  scheduledQuizzes: any[] = [];
  categories: any[] = [];
  selectedCategory: number | null = null;
  searchText = '';
  currentPage = 1;
  totalPages = 1;
  pageSize = 6;

  datePickerModels: { [quizId: number]: string } = {};

  constructor(
    public router: Router,
    private api: ApiService,
    private toast: ToastServiceService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadQuizzes();
  }

  getCategoryName(index: number): string {
    return this.categories.find(c => c.index === index)?.name || 'Custom';
  }

  isValidDate(date: any): boolean {
    return !!date && date !== '0001-01-01T00:00:00' && date !== 'null' && date !== 'undefined';
  }

  loadCategories(): void {
    this.api.admin.getCategoryStats().pipe(
      tap(res => {
        if (res.success) {
          this.categories = res.data;
        }
      }),
      catchError(() => of(null))
    ).subscribe();
  }

  loadQuizzes(): void {
    this.api.admin.getScheduledQuizzes(
      this.currentPage,
      this.pageSize,
      this.selectedCategory,
      this.searchText
    ).pipe(
      tap(res => {
        if (res.success) {
          this.scheduledQuizzes = res.data.quizzes;
          const total = res.data.totalCount || 0;
          this.totalPages = total > 0 ? Math.ceil(total / res.data.limit) : 1;

          // ✅ Initialize datetime picker models from rescheduledAt or scheduledAt
          this.datePickerModels = {};
          for (const quiz of this.scheduledQuizzes) {
            this.datePickerModels[quiz.id] =
              this.isValidDate(quiz.rescheduledAt)
                ? quiz.rescheduledAt
                : quiz.scheduledAt || '';
          }
        } else {
          this.scheduledQuizzes = [];
        }
      }),
      catchError(() => {
        this.toast.show('Failed to load scheduled quizzes.');
        return of(null);
      })
    ).subscribe();
  }

  rescheduleQuiz(quizId: number): void {
    const selectedDate = this.datePickerModels[quizId];
    if (!selectedDate) {
      this.toast.show('Please select a date to reschedule.');
      return;
    }

    const isoDate = new Date(selectedDate).toISOString();

    this.api.admin.rescheduleQuizById(quizId, isoDate).pipe(
      tap(() => {
        this.toast.show('Quiz rescheduled.');
        this.loadQuizzes(); // reload and reset date pickers
      }),
      catchError(() => {
        this.toast.show('Failed to reschedule quiz.');
        return of(null);
      })
    ).subscribe();
  }

  deleteQuiz(quizId: number): void {
    this.api.admin.deleteQuizById(quizId).pipe(
      tap(() => {
        this.toast.show('Quiz deleted.');
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
