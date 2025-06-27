import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { UserService } from '../services/user-service.service';
import { AppToasterService } from '../services/toaster.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };

  captchaToken: string | null = null;
  hidePassword=true;

  constructor(private apiService: ApiService,private router: Router,private toast: AppToasterService,private userService:UserService) {}

  onCaptchaResolved(token: string) {
    this.captchaToken = token;
    console.log('CAPTCHA Token:', token);
  }

  onSubmit(form: any) {
  
    if (form.valid) {
      this.apiService.auth.login(this.loginData).pipe(
        tap((response: any) => {
          console.log('Login API Response:', response);
  
          if (response.success) {
            this.userService.saveUser(response.data)
            console.log('Login successful:', response);
            this.router.navigate(['/dashboard']);
          } else {
            this.toast.error(response.message)
          }
  
       
          this.loginData = { email: '', password: '' };
          this.captchaToken = null;
          form.resetForm();
        }),
        catchError((err) => {
          console.log('Login error:', err.error.message);
          this.toast.error(err.error.message);
  
          this.loginData = { email: '', password: '' };
          this.captchaToken = null;
          form.resetForm();
  
          return of(null); 
        })
      ).subscribe();
    } else {
      console.warn('Form is invalid');
    }
  }
  
  }

