import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { ApiService } from '../api.service';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AppToasterService } from '../services/toaster.service';

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
  isLoading = false;

  categoryMap: { [key: string]: number } = {
    GeneralKnowledge: 0, Science: 1, Technology: 2, History: 3, Mathematics: 4,
    Language: 5, Sports: 6, Entertainment: 7, Other: 8, Geography: 9,
    Literature: 10, Art: 11, CurrentAffairs: 12, Politics: 13, Business: 14,
    Programming: 15, HealthAndFitness: 16, LogicAndReasoning: 17,
    SpaceAndAstronomy: 18, EnvironmentalStudies: 19
  };

  constructor(private route: ActivatedRoute,private router: Router, private api: ApiService, private toast: AppToasterService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoryParam = params.get('category') || '';
      this.currentPage = parseInt(params.get('page') || '1', 10);
      this.categoryIndex = this.categoryMap[this.categoryParam];
      this.isLoading = true;
      this.loadQuestions();
    });
  }


  loadQuestions(): void {
    this.api.admin.getQuestionsByCategory(this.categoryIndex, this.currentPage, this.pageSize, this.searchText)
      .pipe(
        tap(res => {
          if(res.success){
            this.questions = res.data || [];
            const total = res.total ?? 0;
            const limit = res.limit ?? this.pageSize;
            this.totalPages = total > 0 ? Math.ceil(total / limit) : 1;
          }
          this.isLoading = false;
        }),
        catchError(err => {
          this.toast.error(err.error?.message ||'Failed to load questions.');
          console.error('Error loading questions:', err);
          this.isLoading = false;
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
        const next = this.currentPage + 1;
        this.router.navigate(['/questionbank/view', this.categoryParam, 'page', next]);
      }
    }

    prevPage(): void {
      if (this.currentPage > 1) {
        const prev = this.currentPage - 1;
        this.router.navigate(['/questionbank/view', this.categoryParam, 'page', prev]);
      }
    }

  deleteQuestion(id: number): void {
    this.api.admin.deleteQuestionFromBank(id).pipe(
      tap((res) => {
        this.toast.success(res.message);
        this.loadQuestions();
      }),
      catchError((err) => {
        this.toast.error(err.error.message);
        return of(null);
      })
    ).subscribe();
  }

  
}
