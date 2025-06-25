import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { ToastServiceService } from 'src/app/toast-service.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent implements OnInit {
  loading = false;
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
    private toast: ToastServiceService
  ) {}

  ngOnInit(): void {
    // ✅ Properly subscribe to route params
    this.route.params.subscribe(params => {
      this.categoryParam = params['category'] || '';
      this.questionId = +params['id'] || 0;

      if (!this.questionId || !this.categoryParam) {
        this.toast.show('Invalid question or category.');
        this.router.navigate(['/dashboard']);
        return;
      }

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
          this.toast.show('Failed to load question.');
        }
      }),
      catchError(err => {
        console.error('Error fetching question:', err);
        this.toast.show('Error loading question.');
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
        this.toast.show('Question updated successfully!');
        this.router.navigate(['/questionbank/view', this.categoryParam]);
      }),
      catchError(err => {
        console.error('Update failed:', err);
        this.toast.show('Failed to update question.');
        this.loading = false;
        return of(null);
      })
    ).subscribe();
  }

  onCancel(): void {
    this.router.navigate(['/questionbank/view', this.categoryParam]);
  }
}
