import { ChangeDetectorRef, Component, EventEmitter, Input, Output, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface Testcase {
  name: string;
  weightage: number;
}

interface Evaluation {
  evaluation_type: string;
  testcases: Testcase[];
}
@Component({
  selector: 'app-analysis-modal',
  templateUrl: './analysis-modal.component.html',
  styleUrls: ['./analysis-modal.component.css']
})
export class AnalysisModalComponent {
  @Output() closeModalEvent = new EventEmitter();
  @Output() dataEditedEvent = new EventEmitter(); // New event to pass edited data
  datum: Evaluation[] = []; // Define datum as an array of Evaluation objects

  editMode: boolean = true;
  obj: any;
  textareaRows = 5; // Default rows

  constructor(
    public dialogRef: MatDialogRef<AnalysisModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data.response);
    this.obj = data.response;
    console.log(this.obj);


    this.datum =data.response;
    // this.updateWeightages(this.datum, 'karma')
  }

  adjustTextareaSize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    const lineCount = textarea.value.split('\n').length; // Count the number of lines
    this.textareaRows = Math.max(10, lineCount); // Set a minimum row size (e.g., 5)
  }

  cancelEdit(): void {
    this.closeModalEvent.emit();
    this.editMode = false;
    // this.dataEditedEvent.emit(this.data); // Emit edited data
  }

  SaveEdit(): void {
    this.closeModalEvent.emit();
    this.editMode = false;
    console.log(this.obj);

    // this.dataEditedEvent.emit(this.data.response); // Emit edited data
    this.dataEditedEvent.emit(this.obj); // Emit edited data
  }


}
