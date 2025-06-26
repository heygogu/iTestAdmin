import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service'
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeleteModalComponent } from '../confirm-delete-modal/confirm-delete-modal.component';
import { ScheduleModalComponent } from '../schedule-modal/schedule-modal.component';
import { AppToasterService } from '../services/toaster.service';



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
  pageSize = 10;

  datePickerModels: { [quizId: number]: string } = {};

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private modalService:NgbModal,
    private toast: AppToasterService
  ) {}

  selectedStatus: string = '';
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.currentPage = parseInt(params.get('page') || '1', 10);
      this.loadCategories();
      this.loadQuizzes();
    });
  }

  openDeleteModal(quiz: any): void {
  const modalRef = this.modalService.open(ConfirmDeleteModalComponent);
  modalRef.componentInstance.quiz = quiz;

  modalRef.result.then(result => {
    if (result === true) {
      this.deleteQuiz(quiz.id);
    }
  }).catch(() => {});
}



openScheduleModal(quiz: any, isReschedule: boolean): void {
  const modalRef = this.modalService.open(ScheduleModalComponent);
  modalRef.componentInstance.quiz = quiz;
  modalRef.componentInstance.isReschedule = isReschedule;

  modalRef.result.then(date => {
    const isoDate = new Date(date).toISOString();
    this.api.admin.rescheduleQuizById(quiz.id, isoDate).subscribe({
      next: () => {
        this.toast.success(`${isReschedule ? 'Rescheduled' : 'Scheduled'} successfully.`);
        this.loadQuizzes();
      },
      error: () => {
        this.toast.error('Error scheduling quiz.');
      }
    });
  }).catch(() => {});
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

  getStatusLabel(date: string | null): string {
  return this.isValidDate(date) ? 'Scheduled' : 'Draft';
}

getStatusBadge(date: string | null): string {
  return this.isValidDate(date) ? 'success' : 'secondary';
}
exportQuiz(quiz: any): void {
  this.toast.success(`Exporting quiz "${quiz.title}"...`);
  // Integrate real export logic here
}

 loadQuizzes(): void {
  this.api.admin.getAllQuizzes(
    this.currentPage,
    this.pageSize,
    this.selectedCategory,
    this.searchText,
    this.selectedStatus 
  ).pipe(
    tap((res:any) => {
      if (res.success) {
        this.scheduledQuizzes = res.data.quizzes;
        const total = res.data.totalCount || 0;
        this.totalPages = total > 0 ? Math.ceil(total / res.data.limit) : 1;
        this.datePickerModels = {};
        for (const quiz of this.scheduledQuizzes) {
          this.datePickerModels[quiz.id] =
            this.isValidDate(quiz.rescheduledAt)
              ? quiz.rescheduledAt
              : quiz.scheduledAt || '';
        }
      }}),
      catchError(() => {
        this.toast.error('Failed to load scheduled quizzes.');
        return of(null);
      })
    ).subscribe();
  }

  rescheduleQuiz(quizId: number): void {
    const selectedDate = this.datePickerModels[quizId];
    if (!selectedDate) {
      this.toast.warning('Please select a date to reschedule.');
      return;
    }

    const isoDate = new Date(selectedDate).toISOString();

    this.api.admin.rescheduleQuizById(quizId, isoDate).pipe(
      tap(() => {
        this.toast.success('Quiz rescheduled.');
        this.loadQuizzes(); // reload and reset date pickers
      }),
      catchError(() => {
        this.toast.error('Failed to reschedule quiz.');
        return of(null);
      })
    ).subscribe();
  }

  deleteQuiz(quizId: number): void {
    this.api.admin.deleteQuizById(quizId).pipe(
      tap(() => {
        this.toast.success('Quiz deleted.');
        this.loadQuizzes();
      }),
      catchError(() => {
        this.toast.error('Failed to delete quiz.');
        return of(null);
      })
    ).subscribe();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.router.navigate(['/quizzes/page', this.currentPage + 1]);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.router.navigate(['/quizzes/page', this.currentPage - 1]);
    }
  }
}
