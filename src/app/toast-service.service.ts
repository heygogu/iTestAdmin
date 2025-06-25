import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastServiceService {

  constructor(private snackBar: MatSnackBar) { }
   show(message: string, action = 'OK', duration = 3000) {
    this.snackBar.open(message, action, {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['custom-toast'] 
    });
  }
}
