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
  isLoading = false;
  showAddQuestionForm = false;
  
  quiz = {
    title: '',
    description: '',
    scoreToPass: 0,
    questions: [] as any[]
  };
  newQuestion = {
    text: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOption: '',
  };

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private toast: AppToasterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.quizId = +this.route.snapshot.paramMap.get('id')!;
    this.isLoading = true;
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
        this.isLoading = false;
      }),
      catchError(err => {
        console.error(err);
        this.toast.error(err.error?.message ||'Error fetching quiz.');
        this.isLoading = false;
        return of(null);
      })
    ).subscribe();
  }

    addQuestion(): void {
      this.showAddQuestionForm = true;
      this.newQuestion = {
        text: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctOption: ''
      };
    }
    cancelAddQuestion(): void {
      this.showAddQuestionForm = false;
    }


  confirmAddQuestion(): void {
    const { text, optionA, optionB, optionC, optionD, correctOption } = this.newQuestion;

    if (
      !text.trim() ||
      !optionA.trim() ||
      !optionB.trim() ||
      !optionC.trim() ||
      !optionD.trim() ||
      !correctOption
    ) {
      this.toast.warning('Please fill all fields before adding the question.');
      return;
    }

    const options = [optionA, optionB, optionC, optionD].map(opt => opt.trim());
    const uniqueOptions = new Set(options);
    if (uniqueOptions.size < 4) {
      this.toast.warning('Options must be unique.');
      return;
    }

    this.quiz.questions.push({
      id: Date.now(),
      text: text.trim(),
      optionA: optionA.trim(),
      optionB: optionB.trim(),
      optionC: optionC.trim(),
      optionD: optionD.trim(),
      correctOption
    });

    this.toast.success('Question added!');
    this.showAddQuestionForm = false;
  }


  
  updateQuiz(): void {
    this.loading = true;

    const payload = {
      title: this.quiz.title.trim(),
      description: this.quiz.description.trim(),
      scoreToPass: this.quiz.scoreToPass,
      questions: this.quiz.questions.map(q => ({
        text: q.text.trim(),
        optionA: q.optionA.trim(),
        optionB: q.optionB.trim(),
        optionC: q.optionC.trim(),
        optionD: q.optionD.trim(),
        correctOption: q.correctOption
      }))
    };

    this.api.admin.updateQuizById(this.quizId, payload).pipe(
      tap(() => {
        this.toast.success('Quiz updated successfully!');
        this.router.navigate(['/quizzes']);
      }),
      catchError(err => {
        console.error('Failed to update quiz', err);
        this.toast.error(err.error?.message || 'Failed to update quiz.');
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
        this.toast.error(error.error?.message ||'Error removing question from quiz.');
        return of(null);
      })
    ).subscribe();
  }


 
}