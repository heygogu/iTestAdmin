import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AppToasterService } from '../services/toaster.service';

@Component({
  selector: 'app-edit-quiz',
  templateUrl: './edit-quiz.component.html',
  styleUrls: ['./edit-quiz.component.css']
})
export class EditQuizComponent implements OnInit {
  quizId!: number;
  loading = false;

  quiz = {
    title: '',
    description: '',
    scoreToPass: 0,
    questions: [] as any[]
  };

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private toast: AppToasterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.quizId = +this.route.snapshot.paramMap.get('id')!;
    this.loadQuiz();
  }

  loadQuiz(): void {
    this.api.admin.getQuizById(this.quizId).pipe(
      tap((res: any) => {
        if (res?.success && res.data) {
          const { title, description, scoreToPass, questions } = res.data;
          this.quiz = { title, description, scoreToPass, questions };
        } else {
          this.toast.error('Failed to load quiz.');
        }
      }),
      catchError(err => {
        console.error(err);
        this.toast.error('Error fetching quiz.');
        return of(null);
      })
    ).subscribe();
  }

  
  updateQuiz(): void {
    this.loading = true;

    const updatedQuestions = this.quiz.questions.map(q => ({
      id: q.id,
      text: q.text,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctOption: q.correctOption
    }));

    this.api.admin.updateQuizById(this.quizId, updatedQuestions).pipe(
      tap(() => {
        this.toast.success('Quiz updated successfully!');
        this.router.navigate(['/quizzes']);
      }),
      catchError(err => {
        console.error('Failed to update quiz', err);
        this.toast.error('Failed to update quiz.');
        this.loading = false;
        return of(null);
      })
    ).subscribe();
  }

  deleteQuestion(id: number): void {
    this.api.admin.deleteQuestionFromQuiz(this.quizId, id).pipe(
      tap(response => {
        if (response?.success) {
          this.quiz.questions = this.quiz.questions.filter(q => q.id !== id);
          this.toast.success('Question removed from quiz.');
          this.loadQuiz();
        } else {
          this.toast.error('Failed to remove question.');
        }
      }),
      catchError(error => {
        console.error('Failed to delete question', error);
        this.toast.error('Error removing question from quiz.');
        return of(null);
      })
    ).subscribe();
  }


 
}