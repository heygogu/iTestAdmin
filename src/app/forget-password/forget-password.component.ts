import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppToasterService } from '../services/toaster.service';
import { LOCAL_STORAGE } from '../local-storage.token';
import { UserService } from '../services/user-service.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {
  constructor(private apiService: ApiService, private router: Router,private toast: AppToasterService,@Inject(LOCAL_STORAGE) private localStorage:Storage,private userService:UserService) {
     if(this.localStorage.getItem('user')!==null){
      const user = JSON.parse(this.localStorage.getItem('user') || '{}');
      this.userService.saveUser(user)
      router.navigate(["/dashboard"])
    }
  }

  email: string = '';
  loading: boolean = false;

  onSubmit(form: any) {
    if (form.valid) {
      this.loading = true;

      this.apiService.auth.forgotPassword({ email: this.email }).pipe(
        tap(response => {
          console.log('Forgot Password API Response:', response);
          this.toast.success(response.message);
          this.router.navigate(['/reset-password']); 
        }),
        catchError(error => {
          console.error('Forgot Password API Error:', error);
          this.toast.error(error?.error?.message);
          return of(null); 
        })
      ).subscribe(() => {
        this.loading = false;
      });
    } else {
      console.warn('Form is invalid');
    }
  }
}
