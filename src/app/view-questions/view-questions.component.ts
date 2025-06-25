import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { ToastServiceService } from '../toast-service.service';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-view-questions',
  templateUrl: './view-questions.component.html',
  styleUrls: ['./view-questions.component.css']
})
export class ViewQuestionsComponent implements OnInit {
  categoryParam = '';
  categoryIndex = 0;
  currentPage = 1;
  questions: any[] = [];
  totalPages = 1;
  searchText = '';
  pageSize = 10;

  categoryMap: { [key: string]: number } = {
    GeneralKnowledge: 0, Science: 1, Technology: 2, History: 3, Mathematics: 4,
    Language: 5, Sports: 6, Entertainment: 7, Other: 8, Geography: 9,
    Literature: 10, Art: 11, CurrentAffairs: 12, Politics: 13, Business: 14,
    Programming: 15, HealthAndFitness: 16, LogicAndReasoning: 17,
    SpaceAndAstronomy: 18, EnvironmentalStudies: 19
  };

  constructor(private route: ActivatedRoute, private api: ApiService, private toast: ToastServiceService) {}

  ngOnInit(): void {
    this.categoryParam = this.route.snapshot.paramMap.get('category') || '';
    this.categoryIndex = this.categoryMap[this.categoryParam];
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.api.admin.getQuestionsByCategory(this.categoryIndex, this.currentPage, this.pageSize, this.searchText)
      .pipe(
        tap(res => {
          this.questions = res.data || [];
          const total = res.total ?? 0;
          const limit = res.limit ?? this.pageSize;
          this.totalPages = total > 0 ? Math.ceil(total / limit) : 1;
        }),
        catchError(err => {
          this.toast.show('Failed to load questions.');
          console.error('Error loading questions:', err);
          return of(null);
        })
      )
      .subscribe();
  }

  search(): void {
    this.currentPage = 1;
    this.loadQuestions();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadQuestions();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadQuestions();
    }
  }

  deleteQuestion(id: number): void {
    this.api.admin.deleteQuestionFromBank(id).pipe(
      tap(() => {
        this.toast.show('Question deleted successfully!');
        this.loadQuestions();
      }),
      catchError(() => {
        this.toast.show('Failed to delete question.');
        return of(null);
      })
    ).subscribe();
  }

  
}
