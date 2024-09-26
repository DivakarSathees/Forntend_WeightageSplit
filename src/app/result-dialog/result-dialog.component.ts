import { ChangeDetectorRef, Component, EventEmitter, Input, Output, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-result-dialog',
  templateUrl: './result-dialog.component.html',
  styleUrls: ['./result-dialog.component.css']
})
export class ResultDialogComponent {
  @Output() closeModalEvent = new EventEmitter();
  @Output() dataEditedEvent = new EventEmitter(); // New event to pass edited data

  editMode: boolean = true;
  // datum: any;
  datum = {
    testcases: [
      { name: 'Test1', weightage: 0.2 },
      { name: 'Test2', weightage: 0.3 },
      // Add more testcases as needed
    ],
  };

  constructor(
    public dialogRef: MatDialogRef<ResultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {console.log(data.testcases);
    console.log(data.response);

    this.datum =data;
  }

  cancelEdit(): void {
    this.closeModalEvent.emit();
    this.editMode = false;
    // this.dataEditedEvent.emit(this.data); // Emit edited data
  }

  SaveEdit(): void {
    this.closeModalEvent.emit();
    this.editMode = false;
    this.dataEditedEvent.emit(this.data); // Emit edited data
  }
  // updateWeightages(changedTestcase: any): void {
  //   const validTestcases = this.datum.testcases.filter((testcase) => typeof testcase.weightage === 'number');

  //   let totalWeightage = validTestcases.reduce(
  //     (sum, testcase) => sum + (testcase.weightage || 0), // Default to 0 if weightage is undefined
  //     0
  //   );

  //   if (totalWeightage > 1.0) {
  //     // If total weightage exceeds 1.0, revert the changes
  //     changedTestcase.weightage -= totalWeightage - 1.0;
  //     totalWeightage = 1.0; // Update total weightage
  //   }

  //   // Update other weightages proportionally
  //   const remainingWeightage = 1.0 - changedTestcase.weightage;
  //   const otherWeightages = validTestcases.filter((testcase) => testcase !== changedTestcase);

  //   if (otherWeightages.length > 0) {
  //     const totalOtherWeightage = otherWeightages.reduce((sum, testcase) => sum + testcase.weightage, 0);
  //     otherWeightages.forEach((testcase) => (testcase.weightage *= remainingWeightage / totalOtherWeightage));
  //   }
  // }

  updateWeightages(changedTestcase: any): void {
    const validTestcases = this.datum.testcases.filter((testcase) => typeof testcase.weightage === 'number');

    let totalWeightage = validTestcases.reduce(
      (sum, testcase) => sum + (testcase.weightage || 0),
      0
    );

    // Ensure totalWeightage is not NaN or Infinity
    if (isNaN(totalWeightage) || !isFinite(totalWeightage)) {
      totalWeightage = 0;
    }

    if (totalWeightage > 1.0) {
      // If total weightage exceeds 1.0, revert the changes
      changedTestcase.weightage -= totalWeightage - 1.0;
      totalWeightage = 1.0; // Update total weightage
    }

    // Update other weightages proportionally
    const remainingWeightage = 1.0 - changedTestcase.weightage;
    const otherWeightages = validTestcases.filter((testcase) => testcase !== changedTestcase);

    if (otherWeightages.length > 0) {
      const totalOtherWeightage = otherWeightages.reduce((sum, testcase) => sum + (testcase.weightage || 0), 0);

      // Ensure totalOtherWeightage is not NaN or Infinity
      if (isNaN(totalOtherWeightage) || !isFinite(totalOtherWeightage)) {
        return; // Prevent further calculation if totalOtherWeightage is not valid
      }

      otherWeightages.forEach((testcase) => {
        const newWeightage = (testcase.weightage || 0) * (remainingWeightage / totalOtherWeightage);
        // Ensure newWeightage is not NaN or Infinity
        testcase.weightage = isNaN(newWeightage) || !isFinite(newWeightage) ? 0 : newWeightage;
      });
    }
  }



}
