import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { UserService } from '../services/user-service.service';
import { AppToasterService } from '../services/toaster.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  userId: number = 0;
  email: string = '';

  profileData = {
    fullName: '',
    phoneNumber: '',
    country: '',
    gender: ''
  };

  constructor(
    private api: ApiService,
    private userService: UserService,
    private toast: AppToasterService,
  ) {}

  ngOnInit(): void {
    const user = this.userService.getUser();
    if (user) {
      this.userId = Number(user.id);
      this.email = user.email; // 💡 Load email separately
      this.loadProfile();
    } else {
      console.error('User not found in localStorage');
    }
  }


  loadProfile(): void {
    this.api.user.getProfile(this.userId).pipe(
      tap((res: any) => {
        if (res.success && res.data) {
          this.profileData = res.data;
        } else {
          console.warn('Profile fetch failed');
        }
      }),
      catchError(err => {
        console.error('Error fetching profile:', err);
        return of(null);
      })
    ).subscribe();
  }

  onSubmit(form: any): void {
    if (form.valid) {
      this.api.user.updateProfile(this.userId, this.profileData).pipe(
        tap((res: any) => {
          if (res.success) {
            this.toast.success('Profile updated successfully!');

            // 🔁 Update localStorage
            const currentUser = this.userService.getUser();
            if (currentUser) {
              this.userService.saveUser({
                ...currentUser,
                fullName: this.profileData.fullName  // update the display name
              });
            }
          } else {
            this.toast.error('Failed to update profile.');
          }
        }),
        catchError(err => {
          console.error('Update error:', err);
          this.toast.error('Error while updating profile.');
          return of(null);
        })
      ).subscribe();
    } else {
      console.warn('Form is invalid');
    }
  }

}
