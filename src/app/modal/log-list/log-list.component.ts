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

interface FailedTest {
  testName: string;
  errorMessage: string;
}
@Component({
  selector: 'app-log-list',
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.css']
})
export class LogListComponent {
  @Output() closeModalEvent = new EventEmitter();
  @Output() dataEditedEvent = new EventEmitter(); // New event to pass edited data
  datum: Evaluation[] = []; // Define datum as an array of Evaluation objects
  failed: FailedTest[] = [];
  editMode: boolean = true;
  failedLog = false;
  compilationError = false;
  obj: any;

  constructor(
    public dialogRef: MatDialogRef<LogListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data.response);
    this.obj = JSON.parse(data.response);
    console.log(this.obj);
    this.failed = this.obj.failed as FailedTest[];
    if(this.failed != undefined){
      this.failedLog=true
    } else{
      this.compilationError = true;
    }
    console.log(this.failed);



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
