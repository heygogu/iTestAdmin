import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RecaptchaFormsModule } from 'ng-recaptcha';
import { RecaptchaModule } from 'ng-recaptcha';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { ListQuizComponent } from './list-quiz/list-quiz.component';
import { CreateQuizComponent } from './create-quiz/create-quiz.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component'; 
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SharedLayoutComponent } from './shared-layout/shared-layout.component';
import {LayoutModule} from '@angular/cdk/layout';
import { EditQuestionComponent } from './edit-question/edit-question.component';

// Angular Material modules
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CustomQuizComponent } from './create-quiz/custom-quiz/custom-quiz.component';
import { RandomQuizComponent } from './create-quiz/random-quiz/random-quiz.component';
import { QuestionBankComponent } from './question-bank/question-bank.component';
import { ScheduleQuizComponent } from './schedule-quiz/schedule-quiz.component'; 
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ApiService } from './api.service';
import { HttpClientModule } from '@angular/common/http';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AddQuestionComponent } from './add-question/add-question.component';
import { ViewQuestionsComponent } from './view-questions/view-questions.component';
import { EditQuizComponent } from './edit-quiz/edit-quiz.component';
import {ToastrModule} from 'ngx-toastr';
import { ConfirmDeleteModalComponent } from './confirm-delete-modal/confirm-delete-modal.component';
import { ScheduleModalComponent } from './schedule-modal/schedule-modal.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmDeleteModalComponent,
    ScheduleModalComponent,
    DashboardComponent,
    UsersComponent,
    ListQuizComponent,
    CreateQuizComponent,
    UserDetailsComponent,
    LoginComponent,
    RegisterComponent,
    CustomQuizComponent,
    RandomQuizComponent,
    QuestionBankComponent,
    ScheduleQuizComponent,
    EditProfileComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    EditProfileComponent,
    PageNotFoundComponent,
    AddQuestionComponent,
    ViewQuestionsComponent,
    SharedLayoutComponent,
    ScheduleQuizComponent,
    EditQuestionComponent,
    EditQuestionComponent,
    EditQuizComponent,
    ConfirmDeleteModalComponent,
    ScheduleModalComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    ToastrModule.forRoot({
      timeOut:3000,
      enableHtml:true,
      positionClass:'toast-top-right',
      preventDuplicates:true,
    }),
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonToggleModule,
    RecaptchaFormsModule,
    RecaptchaModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HttpClientModule,
    MatRadioModule,
    MatSnackBarModule,
    LayoutModule,
    NgChartsModule
    ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
