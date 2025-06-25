import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-quiz',
  templateUrl: './list-quiz.component.html',
  styleUrls: ['./list-quiz.component.css']
})
export class ListQuizComponent implements OnInit {

  constructor(public router: Router) {}
   availableQuizzes: any[] = [];
  editingQuizId: string | null = null;
  minDate: string = '';

  ngOnInit(): void {
    this.loadAvailableQuizzes();
    this.setMinDate();
  }

  setMinDate() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  loadAvailableQuizzes() {
    const data = localStorage.getItem('availableQuizzes');
    this.availableQuizzes = data ? JSON.parse(data) : [];
  }

  saveToStorage() {
    localStorage.setItem('availableQuizzes', JSON.stringify(this.availableQuizzes));
  }

  editDueDate(quizId: string) {
    this.editingQuizId = quizId;
  }

  cancelEdit() {
    this.editingQuizId = null;
    this.loadAvailableQuizzes(); // Restore original due date
  }

  saveDueDate(quiz: any) {
    if (!quiz.dueDate || quiz.dueDate < this.minDate) {
      alert('Please select a valid future date.');
      return;
    }

    this.saveToStorage();
    this.editingQuizId = null;
    alert('Due date updated successfully!');
  }

  deleteQuiz(quiz: any) {
    if (confirm('Are you sure you want to delete this quiz?')) {
      this.availableQuizzes = this.availableQuizzes.filter(q => q.testId !== quiz.testId);
      this.saveToStorage();
    }
  }
}
