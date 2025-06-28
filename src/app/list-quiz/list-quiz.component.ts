import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service'
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeleteModalComponent } from '../confirm-delete-modal/confirm-delete-modal.component';
import { ScheduleModalComponent } from '../schedule-modal/schedule-modal.component';
import { AppToasterService } from '../services/toaster.service';
import { saveAs } from 'file-saver';


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
  isLoading = false;

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
      this.isLoading = true;
      this.loadQuizzes();
    });
  }

  toISTDate(dateString: string): Date | null {
    if (!dateString) return null;
    const utcDate = new Date(dateString);
    const istOffset = 5.5 * 60 * 60 * 1000; 
    return new Date(utcDate.getTime() + istOffset);
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
    const apiCall = isReschedule
      ? this.api.admin.rescheduleQuizById(quiz.id, isoDate)
      : this.api.admin.scheduleQuizById(quiz.id, isoDate);

    apiCall.pipe(
      tap(() => {
        const msg = isReschedule ? 'Quiz rescheduled successfully.' : 'Quiz scheduled successfully.';
        this.toast.success(msg);
        this.loadQuizzes();
      }),
      catchError((err) => {
        const fallbackMsg = isReschedule ? 'Failed to reschedule quiz.' : 'Failed to schedule quiz.';
        this.toast.error(err.error?.message || fallbackMsg);
        return of(null);
      })
    ).subscribe();
    
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
  this.api.admin.exportQuizResultsById(quiz.id).pipe(
    tap((blob: Blob) => {
      const fileName = `quiz-results-${quiz.title.replace(/\s+/g, '_')}.csv`;
      saveAs(blob, fileName);
      this.toast.success(`Quiz "${quiz.title}" exported successfully!`);
    }),
    catchError((err) => {
      console.error('Export failed:', err);
      this.toast.error(err.error?.message || `Failed to export quiz "${quiz.title}".`);
      return of(null); 
    })
  ).subscribe();
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
      }
      this.isLoading = false;
    }),
      catchError(err => {
        this.toast.error(err.error?.message ||'Failed to load quizzes.');
        this.isLoading = false;
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
        this.loadQuizzes(); 
      }),
      catchError((err) => {
        this.toast.error(err.error?.message ||'Failed to reschedule quiz.');
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
      catchError((err) => {
        this.toast.error(err.error?.message ||'Failed to delete quiz.');
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
