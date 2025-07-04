import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { ListQuizComponent } from './list-quiz/list-quiz.component';
import { CreateQuizComponent } from './create-quiz/create-quiz.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { QuestionBankComponent } from './question-bank/question-bank.component';
import { ScheduleQuizComponent } from './schedule-quiz/schedule-quiz.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { SharedLayoutComponent } from './shared-layout/shared-layout.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MatRadioModule } from '@angular/material/radio';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AddQuestionComponent } from './add-question/add-question.component';
import { ViewQuestionsComponent } from './view-questions/view-questions.component';
import { EditQuestionComponent } from './edit-question/edit-question.component';
import { AuthGuard } from './guards/auth.guard';
import { EditQuizComponent } from './edit-quiz/edit-quiz.component';

const routes: Routes = [
  { path: '', redirectTo: 'admin-login', pathMatch: 'full' },
  { path: 'admin-login', component: LoginComponent },
  { path: 'admin-register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgetPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  {
    path: '',
    component: SharedLayoutComponent,
    canActivate:[AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users/page/:page', component: UsersComponent },
      { path: 'users', redirectTo: 'users/page/1', pathMatch: 'full' },
      { path: 'user-details/:id/:page', component: UserDetailsComponent },
      { path: 'user-details/:id', redirectTo: 'user-details/:id/1', pathMatch: 'full' },
      { path: 'quizzes/page/:page', component: ListQuizComponent },
      { path: 'quizzes', redirectTo: 'quizzes/page/1', pathMatch: 'full' },
      { path: 'create-quiz', component: CreateQuizComponent },
      { path: 'question-bank', component: QuestionBankComponent },
      { path: 'schedule-quiz/page/:page', component: ScheduleQuizComponent },
      { path: 'schedule-quiz', redirectTo: 'schedule-quiz/page/1', pathMatch: 'full' },
      { path: 'edit-profile', component: EditProfileComponent },
      { path: 'questionbank/add/:category', component: AddQuestionComponent },
      { path: 'questionbank/view/:category/page/:page', component: ViewQuestionsComponent }, 
      { path: 'questionbank/view/:category/edit-question/:id', component: EditQuestionComponent},
      { path: 'edit-quiz/:id', component: EditQuizComponent },

    ]
  },

  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
