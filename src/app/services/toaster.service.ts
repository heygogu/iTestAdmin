import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AppToasterService {
  constructor(private toastr: ToastrService) {}

  success(message: string, title: string = 'Success') {
    this.toastr.success(`${message}`, title, { enableHtml: true });
  }

  error(message: string, title: string = 'Error') {
    this.toastr.error(`${message}`, title, { enableHtml: true });
  }

  info(message: string, title: string = 'Info') {
    this.toastr.info(`${message}`, title, { enableHtml: true });
  }

  warning(message: string, title: string = 'Warning') {
    this.toastr.warning(`${message}`, title, { enableHtml: true });
  }
}
