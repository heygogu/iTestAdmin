import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schedule-quiz',
  templateUrl: './schedule-quiz.component.html',
  styleUrls: ['./schedule-quiz.component.css']
})
export class ScheduleQuizComponent implements OnInit {
createdQuizzes: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('createdQuizzes');
    this.createdQuizzes = stored ? JSON.parse(stored) : [];
  }

  scheduleQuiz(quiz: any) {
    if (!quiz.dueDate) {
      alert('Please select a due date before publishing.');
      return;
    }

    const stored = localStorage.getItem('availableQuizzes');
    const availableQuizzes = stored ? JSON.parse(stored) : [];

    // Add due date and mark as scheduled
    const quizToPublish = { ...quiz, scheduled: true };

    availableQuizzes.push(quizToPublish);
    localStorage.setItem('availableQuizzes', JSON.stringify(availableQuizzes));

    alert('Quiz scheduled and published!');
  }

   deleteQuiz(quiz: any) {
    const confirmDelete = confirm(`Are you sure you want to delete the quiz "${quiz.name}"?`);
    if (!confirmDelete) return;

    const stored = localStorage.getItem('createdQuizzes');
    let createdQuizzes = stored ? JSON.parse(stored) : [];

    // Remove quiz by testId
    createdQuizzes = createdQuizzes.filter((q: { testId: any; }) => q.testId !== quiz.testId);
    localStorage.setItem('createdQuizzes', JSON.stringify(createdQuizzes));

    // Update the local array used for rendering
    this.createdQuizzes = createdQuizzes;

    alert('Quiz deleted successfully!');
  }
}
