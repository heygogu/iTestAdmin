import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-custom-quiz',
  templateUrl: './custom-quiz.component.html',
  styleUrls: ['./custom-quiz.component.css']
})
export class CustomQuizComponent implements OnInit {
  categories: { index: number, name: string, totalQuestions: number }[] = [];

  quiz = {
    title: '',
    description: '',
    category: '',
    passScore: 0,
    questions: [] as {
      text: string;
      optionA: string;
      optionB: string;
      optionC: string;
      optionD: string;
      correctOption: 'A' | 'B' | 'C' | 'D';
    }[]
  };

  newQuestion = {
    text: '',
    options: ['', '', '', ''],
    correctAnswer: ''
  };

  constructor(
    private apiService: ApiService,
    private toast: AppToasterService
  ) {}

  ngOnInit(): void {
    this.apiService.admin.getCategoryStats().pipe(
      tap(res => {
        if (res.success) {
          this.categories = res.data;
        }
      }),
      catchError(err => {
        console.error('Error loading categories:', err);
        this.toast.error('Failed to load categories.');
        return of(null);
      })
    ).subscribe();
  }

  addQuestion(form: any) {
    const { text, options, correctAnswer } = this.newQuestion;

    if (!text.trim() || options.some(opt => !opt.trim()) || !correctAnswer) {
      this.toast.warning('Please fill all question fields and select the correct answer.');
      return;
    }

    const uniqueOptions = new Set(options.map(opt => opt.trim()));
    if (uniqueOptions.size < 4) {
      this.toast.warning('Options must be unique.');
      return;
    }

    this.quiz.questions.push({
      text: text.trim(),
      optionA: options[0].trim(),
      optionB: options[1].trim(),
      optionC: options[2].trim(),
      optionD: options[3].trim(),
      correctOption: correctAnswer as 'A' | 'B' | 'C' | 'D'
    });

    this.newQuestion = {
      text: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    };

    form.resetForm();
  }
  deleteQuestion(index: number) {
    this.quiz.questions.splice(index, 1);
    this.toast.success('Question deleted.');
  }



  hasInvalidOptions(): boolean {
    return this.newQuestion.options.some(opt => !opt.trim());
  }

  saveQuiz() {
    if (
        !this.quiz.title.trim() ||
        !this.quiz.description.trim() ||
        this.quiz.category === '' ||
        isNaN(this.quiz.passScore) || this.quiz.passScore <= 0 ||
        this.quiz.questions.length === 0
      ) {
        this.toast.warning('Please complete all fields and add at least one question.');
        return;
      }


    const payload = {
      title: this.quiz.title.trim(),
      description: this.quiz.description.trim(),
      category: Number(this.quiz.category),
      scoreToPass: Number(this.quiz.passScore),
      scheduledAt: null,
      questions: this.quiz.questions
    };

    this.apiService.admin.saveCustomQuiz(payload).pipe(
      tap(() => {
        this.toast.success('Custom quiz saved.');
        this.resetQuizForm();
      }),
      catchError(err => {
        console.error('Error saving custom quiz:', err);
        this.toast.error('Failed to save quiz.');
        return of(null);
      })
    ).subscribe();
  }

  scheduleNow() {
    if (
        !this.quiz.title.trim() ||
        !this.quiz.description.trim() ||
        this.quiz.category === '' ||
        isNaN(this.quiz.passScore) || this.quiz.passScore <= 0 ||
        this.quiz.questions.length === 0
      ) {
        this.toast.warning('Please complete all fields and add at least one question.');
        return;
      }

    const payload = {
      title: this.quiz.title.trim(),
      description: this.quiz.description.trim(),
      category: Number(this.quiz.category),
      scoreToPass: Number(this.quiz.passScore),
      scheduledAt: new Date(Date.now() + 5000).toISOString(),
      questions: this.quiz.questions
    };

    this.apiService.admin.saveCustomQuiz(payload).pipe(
      tap(() => {
        this.toast.success('Custom quiz scheduled successfully!');
        this.resetQuizForm();
      }),
      catchError(err => {
        console.error('Error scheduling custom quiz:', err);
        this.toast.error('Failed to schedule quiz.');
        return of(null);
      })
    ).subscribe();
  }

  resetQuizForm() {
    this.quiz = {
      title: '',
      description: '',
      category: '',
      passScore: 0,
      questions: []
    };
    this.newQuestion = {
      text: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    };
  }
}
