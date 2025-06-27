import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppToasterService } from '../services/toaster.service';

interface CategoryStats {
  index: number;
  name: string;
  totalQuestions: number;
}

@Component({
  selector: 'app-question-bank',
  templateUrl: './question-bank.component.html',
  styleUrls: ['./question-bank.component.css']
})
export class QuestionBankComponent implements OnInit {

  constructor(private router: Router, private api: ApiService,private toast:AppToasterService) {}

  categories: CategoryStats[] = [];
 isLoading = false;

  ngOnInit(): void {
    this.isLoading = true;

    this.api.admin.getCategoryStats().pipe(
      tap(res => {
        this.categories = res.data;
        this.isLoading = false;
      }),
      catchError(err => {
        console.error('Failed to load category stats');
        this.toast.error(err.error?.message || 'Failed to load category stats');
        this.isLoading = false;
        return of(null); 
      })
    ).subscribe();
  }



  showAddForm(category: string) {
    this.router.navigate(['/questionbank/add', category]);
  }

  showQuestionList(category: string) {
   this.router.navigate(['/questionbank/view', category, 'page', 1]);
  }
}