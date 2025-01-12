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
  selector: 'app-question-data',
  templateUrl: './question-data.component.html',
  styleUrls: ['./question-data.component.css']
})
export class QuestionDataComponent {
  @Output() closeModalEvent = new EventEmitter();
  @Output() dataEditedEvent = new EventEmitter(); // New event to pass edited data
  datum: Evaluation[] = []; // Define datum as an array of Evaluation objects

  editMode: boolean = true;
  obj: any;

  constructor(
    public dialogRef: MatDialogRef<QuestionDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data.response);
    this.obj = data.response;
    console.log(this.obj);


    this.datum =data.response;
    // this.updateWeightages(this.datum, 'karma')
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
