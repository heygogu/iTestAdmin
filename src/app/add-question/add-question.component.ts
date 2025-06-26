import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AppToasterService } from '../services/toaster.service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {

  categoryMap: { [key: string]: number } = {
    GeneralKnowledge: 0,
    Science: 1,
    Technology: 2,
    History: 3,
    Mathematics: 4,
    Language: 5,
    Sports: 6,
    Entertainment: 7,
    Other: 8,
    Geography: 9,
    Literature: 10,
    Art: 11,
    CurrentAffairs: 12,
    Politics: 13,
    Business: 14,
    Programming: 15,
    HealthAndFitness: 16,
    LogicAndReasoning: 17,
    SpaceAndAstronomy: 18,
    EnvironmentalStudies: 19
  };
  
  categoryParam: string = '';
  loading = false;

  newQuestion = {
    text: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOption: ''
  };

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toast: AppToasterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryParam = this.route.snapshot.paramMap.get('category') || '';
  }

  onSubmit(form: any): void {
    if (!form.valid) return;

    const categoryEnum = this.categoryMap[this.categoryParam];
    if (categoryEnum === undefined) {
      this.toast.warning('Invalid category.');
      return;
    }

    const payload = {
      text: this.newQuestion.text.trim(),
      optionA: this.newQuestion.optionA.trim(),
      optionB: this.newQuestion.optionB.trim(),
      optionC: this.newQuestion.optionC.trim(),
      optionD: this.newQuestion.optionD.trim(),
      correctOption: this.newQuestion.correctOption,
      category: categoryEnum   
    };

    this.loading = true;

    this.apiService.admin.addQuestionToBank(payload).pipe(
      tap(() => {
        this.toast.success('Question added successfully!');
      }),
      catchError(err => {
        console.error(err);
        this.toast.error('Failed to add question.');
        return of(null);
      })
    ).subscribe(() => {
      this.loading = false;
    });
  }
  goBack() {
    this.router.navigate(['/question-bank']);
  }
}
