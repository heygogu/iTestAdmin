import { Component, OnInit } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { ToastServiceService } from 'src/app/toast-service.service';
import { AppToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-random-quiz',
  templateUrl: './random-quiz.component.html',
  styleUrls: ['./random-quiz.component.css']
})
export class RandomQuizComponent implements OnInit {

  categories: { index: number, name: string, totalQuestions: number }[] = [];
  private generatedQuestionCount: number | null = null;


  quiz = {
    name: '',
    description: '',
    category: '',
    questionCount: 0,
    passScore: 0,
    questions: [] as any[]
  };

  constructor(private apiService: ApiService,private toast: AppToasterService) {}

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

  generateRandomQuiz() {
    if (this.quiz.category == null || !this.quiz.questionCount) {
      this.toast.warning('Please select a category and enter a question count.');
      return;
    }

    const categoryIndex = Number(this.quiz.category);
    const selectedCategory = this.categories.find(c => c.index === categoryIndex);

    if (!selectedCategory) {
      this.toast.error('Selected category is invalid.');
      return;
    }

    if (this.quiz.questionCount > selectedCategory.totalQuestions) {
      this.toast.warning(
        `Only ${selectedCategory.totalQuestions} questions are available in this category. Please reduce the count.`
      );
      return;
    }

    const limit = this.quiz.questionCount;

    this.apiService.admin.getRandomQuestions(categoryIndex, limit).pipe(
      tap((res) => {
        if (res?.success && Array.isArray(res.data)) {
          this.quiz.questions = res.data;
          this.generatedQuestionCount = this.quiz.questionCount;
        } else {
          this.toast.error('Unexpected response from server.');
        }
      }),
      catchError(err => {
        console.error('Error fetching questions:', err);
        this.toast.error('Failed to generate quiz.');
        return of(null);
      })
    ).subscribe();
  }

  

  saveQuiz() {
    if (!this.quiz.name || !this.quiz.description || !this.quiz.passScore || this.quiz.questions.length === 0) {
      this.toast.warning('Please complete all fields and generate the quiz before saving.');
      return;
    }
    if (this.quiz.questionCount !== this.generatedQuestionCount) {
      this.toast.warning('Number of questions was changed. Please regenerate the quiz before saving.');
      return;
    }    
    if (this.quiz.passScore > this.quiz.questions.length) {
      this.toast.warning(`Pass score cannot be more than ${this.quiz.questions.length} (total questions).`);
      return;
    }
  
    const payload = {
      title: this.quiz.name,
      description: this.quiz.description,
      category: Number(this.quiz.category),
      scoreToPass: Number(this.quiz.passScore),
      selectedQuestionIds: this.quiz.questions.map(q => q.id),
      scheduledAt: null 
    };
    
    console.log('Payload:', JSON.stringify(payload));
  
    this.apiService.admin.saveRandomQuiz(payload).pipe(
      tap(() => {
        this.toast.success('Quiz saved as draft.');
        this.resetQuizForm();
      }),
      catchError(err => {
        console.error('Error saving quiz:', err);
        this.toast.error('Failed to save quiz.');
        return of(null);
      })
    ).subscribe();
  }
  
  scheduleNow() {
    if (!this.quiz.name || !this.quiz.description || !this.quiz.passScore || this.quiz.questions.length === 0) {
      this.toast.warning('Please complete all fields and generate the quiz before scheduling.');
      return;
    }
    if (this.quiz.questionCount !== this.generatedQuestionCount) {
      this.toast.warning('Number of questions was changed. Please regenerate the quiz before saving.');
      return;
    }    
    if (this.quiz.passScore > this.quiz.questions.length) {
      this.toast.warning(`Pass score cannot be more than ${this.quiz.questions.length} (total questions).`);
      return;
    }
  
    const payload = {
      title: this.quiz.name,
      description: this.quiz.description,
      category: Number(this.quiz.category),
      scoreToPass: Number(this.quiz.passScore),
      selectedQuestionIds: this.quiz.questions.map(q => q.id),
      scheduledAt: new Date(Date.now() + 5000).toISOString()
    };
  
    this.apiService.admin.saveRandomQuiz(payload).pipe(
      tap(() => {
        this.toast.success('Quiz scheduled successfully!');
        this.resetQuizForm();
      }),
      catchError(err => {
        console.error('Error scheduling quiz:', err);
        this.toast.error('Failed to schedule quiz.');
        return of(null);
      })
    ).subscribe();
  }
  

  resetQuizForm() {
    this.quiz = {
      name: '',
      description: '',
      category: '',
      questionCount: 0,
      passScore: 0,
      questions: []
    };
    this.generatedQuestionCount = null;
  }
}
