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
  selector: 'app-tc-list',
  templateUrl: './tc-list.component.html',
  styleUrls: ['./tc-list.component.css']
})
export class TcListComponent {
  @Output() closeModalEvent = new EventEmitter();
    @Output() dataEditedEvent = new EventEmitter(); // New event to pass edited data
    datum: Evaluation[] = []; // Define datum as an array of Evaluation objects

    editMode: boolean = true;
    obj: any;
    // datum: any;
    // datum = {
    //   testcases: [
    //     { name: 'Test1', weightage: 0.2 },
    //     { name: 'Test2', weightage: 0.3 },
    //     // Add more testcases as needed
    //   ],
    // };

    constructor(
      public dialogRef: MatDialogRef<TcListComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      console.log(data.response[0]);
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
