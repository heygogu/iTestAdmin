import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppToasterService } from '../services/toaster.service';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent implements OnInit {
  loading = false;
  isLoading = false;
  questionId: number = 0;
  categoryParam: string = '';

  question = {
    text: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOption: '',
    category: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private toast: AppToasterService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryParam = params['category'] || '';
      this.questionId = +params['id'] || 0;

      if (!this.questionId || !this.categoryParam) {
        this.toast.warning('Invalid question or category.');
        this.router.navigate(['/dashboard']);
        return;
      }
      this.isLoading = true;
      this.loadQuestion();
    });
  }

  loadQuestion(): void {
    this.apiService.admin.getQuestionById(this.questionId).pipe(
      tap(res => {
        if (res && res.success && res.data) {
          this.question = {
            text: res.data.text,
            optionA: res.data.optionA,
            optionB: res.data.optionB,
            optionC: res.data.optionC,
            optionD: res.data.optionD,
            correctOption: res.data.correctOption,
            category: res.data.category
          };
        } else {
          this.toast.error('Failed to load question.');
        }
        this.isLoading = false;
      }),
      catchError(err => {
        console.error('Error fetching question:', err);
        this.toast.error(err.error?.message ||'Error loading question.');
        this.isLoading = false;
        return of(null);
      })
    ).subscribe();
  }

  onSubmit(form: any): void {
    if (!form.valid) return;

    this.loading = true;

    const updatedQuestion = {
      text: this.question.text.trim(),
      optionA: this.question.optionA.trim(),
      optionB: this.question.optionB.trim(),
      optionC: this.question.optionC.trim(),
      optionD: this.question.optionD.trim(),
      correctOption: this.question.correctOption,
      category: this.question.category
    };

    this.apiService.admin.updateQuestionById(this.questionId, updatedQuestion).pipe(
      tap(() => {
        this.toast.success('Question updated successfully!');
        this.router.navigate(['/questionbank/view', this.categoryParam, 'page', 1]);
      }),
      catchError(err => {
        console.error('Update failed:', err);
        this.toast.error(err.error?.message ||'Failed to update question.');
        this.loading = false;
        return of(null);
      })
    ).subscribe();
  }
  areOptionsUnique(): boolean {
    const { optionA, optionB, optionC, optionD } = this.question;
    const trimmedOptions = [
      optionA.trim(),
      optionB.trim(),
      optionC.trim(),
      optionD.trim()
    ];
    const uniqueOptions = new Set(trimmedOptions);
    return uniqueOptions.size === 4;
  }


  onCancel(): void {
    this.router.navigate(['/questionbank/view', this.categoryParam, 'page', 1]);
  }
}
