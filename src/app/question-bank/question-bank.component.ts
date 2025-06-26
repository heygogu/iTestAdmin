import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

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
  constructor(private router: Router, private api: ApiService) {}

  categories: CategoryStats[] = [];

  ngOnInit(): void {
    this.api.admin.getCategoryStats().subscribe({
      next: (res) => {
        this.categories = res.data;
      },
      error: () => {
        console.error('Failed to load category stats');
      }
    });
  }

  showAddForm(category: string) {
    this.router.navigate(['/questionbank/add', category]);
  }

  showQuestionList(category: string) {
   this.router.navigate(['/questionbank/view', category, 'page', 1]);
  }
}