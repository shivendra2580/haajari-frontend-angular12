import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  dotOpacityLoader = false;
  @Output() proceed = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onProceed() {
    this.proceed.emit();
  }

  onCancel() {
    this.cancel.emit();
  }


}
