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
  questionsToAdd: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toast: AppToasterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryParam = this.route.snapshot.paramMap.get('category') || '';
  }
  
    areAllOptionsFilled(): boolean {
      const { optionA, optionB, optionC, optionD } = this.newQuestion;
      return !!optionA.trim() && !!optionB.trim() && !!optionC.trim() && !!optionD.trim();
    }
    areOptionsUnique(): boolean {
      const { optionA, optionB, optionC, optionD } = this.newQuestion;
      const options = [optionA.trim(), optionB.trim(), optionC.trim(), optionD.trim()];
      const uniqueOptions = new Set(options);
      return uniqueOptions.size === 4;
    }

    addToPreview(form: any): void {
      form.form.markAllAsTouched();

      if (!form.valid) return;
      if (!this.areAllOptionsFilled()) {
        this.toast.warning('Please fill in all options.');
        return;
      }
      if (!this.areOptionsUnique()) {
        this.toast.warning('Options must be unique.');
        return;
      }
      if (!this.newQuestion.correctOption) {
        this.toast.warning('Please select the correct option.');
        return;
      }
      const trimmed = {
        text: this.newQuestion.text.trim(),
        optionA: this.newQuestion.optionA.trim(),
        optionB: this.newQuestion.optionB.trim(),
        optionC: this.newQuestion.optionC.trim(),
        optionD: this.newQuestion.optionD.trim(),
        correctOption: this.newQuestion.correctOption
      };

      const exists = this.questionsToAdd.some(q => q.text === trimmed.text);
      if (exists) {
        this.toast.warning('Duplicate question not allowed.');
        return;
      }

      this.questionsToAdd.push(trimmed);

      this.newQuestion = {
        text: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctOption: ''
      };

      form.resetForm();
    }

    saveAllQuestions(): void {
      if (this.questionsToAdd.length === 0) {
        this.toast.warning('No questions to save.');
        return;
      }

      const categoryEnum = this.categoryMap[this.categoryParam];
      if (categoryEnum === undefined) {
        this.toast.warning('Invalid category.');
        return;
      }
      this.loading = true;
      const questionList = this.questionsToAdd.map(q => ({
        ...q,
        category: categoryEnum
      }));

      this.apiService.admin.addQuestionsToBank(questionList).pipe(
        tap(() => {
          this.toast.success('Questions saved successfully!');
          this.questionsToAdd = [];
        }),
        catchError(err => {
          console.error(err);
          this.toast.error(err.error?.message || 'Failed to save questions.');
          return of(null);
        })
      ).subscribe(() => {
        this.loading = false;
      });
    }

    removeQuestion(index: number): void {
      this.questionsToAdd.splice(index, 1);
    }

  goBack() {
    this.router.navigate(['/question-bank']);
  }
}
