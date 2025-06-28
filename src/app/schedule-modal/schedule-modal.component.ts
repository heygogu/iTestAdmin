import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-schedule-modal',
  template: `
    <div class="modal-header bg-primary text-white">
      <h5 class="modal-title fs-5 mt-2">{{ isReschedule ? 'Reschedule Quiz' : 'Schedule Quiz' }}</h5>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <h5 class="text-primary fs-5">{{ quiz.title }}</h5>
      <p class="text-muted mb-4 fs-6">{{ quiz.description || 'No description.' }}</p>

      <label class="form-label">Select Date & Time</label>
      <input type="datetime-local" class="form-control" [(ngModel)]="selectedDate" />
    </div>
    <div class="modal-footer justify-content-between">
      <button class="btn btn-outline-secondary" (click)="activeModal.dismiss()">Cancel</button>
      <button class="btn btn-success" (click)="submit()">Confirm</button>
    </div>
  `
})
export class ScheduleModalComponent {
  @Input() quiz: any;
  @Input() isReschedule: boolean = false;
  selectedDate: string = '';

  constructor(public activeModal: NgbActiveModal) {}

  submit() {
    if (!this.selectedDate) return;
    this.activeModal.close(this.selectedDate);
  }
}