import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {
  today = new Date();
  maxDate = new Date(this.today.getFullYear() - 18, this.today.getMonth(), this.today.getDate());

  profileData = {
    name: '',
    email: '',
    mobile: '',
    country: '',
    gender: ''
  };
  
  onSubmit(form: any) {
    if (form.valid) {
      console.log('Updated Profile:', this.profileData);
      alert('Profile updated successfully!');
    } else {
      console.warn('Form is invalid');
    }
  }
}
