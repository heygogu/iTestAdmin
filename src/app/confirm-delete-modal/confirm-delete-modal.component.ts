// confirm-delete-modal.component.ts
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-delete-modal',
  template: `
    <div class="modal-header bg-danger text-white">
      <h5 class="modal-title fs-5 mt-2">Confirm Delete</h5>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body text-center">
      <i class="bi bi-exclamation-triangle fs-1 text-danger"></i>
      <p class="fs-5 mt-3">Are you sure you want to delete quiz "<strong>{{ quiz.title }}</strong>"?</p>
    </div>
    <div class="modal-footer justify-content-between">
      <button class="btn btn-outline-secondary" (click)="activeModal.dismiss()">Cancel</button>
      <button class="btn btn-danger" (click)="activeModal.close(true)">Delete</button>
    </div>
  `
})
export class ConfirmDeleteModalComponent {
  @Input() quiz: any;
  constructor(public activeModal: NgbActiveModal) {}
}
