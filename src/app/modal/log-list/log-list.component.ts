import { ChangeDetectorRef, Component, EventEmitter, Input, Output, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
  failed: FailedTest[] = [];
  errors: string[] = [];
  editMode: boolean = true;
  failedLog = false;
  compilationError = false;

  constructor(
    public dialogRef: MatDialogRef<LogListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Parse the response data as JSON objects
    const parsedData = data.response.map((response: string) => {
      return JSON.parse(response);
    });
    console.log(parsedData);


    // Initialize failed array and errors array
    this.failed = [];
    this.errors = [];

    // Process each parsed object
    parsedData.forEach((result: any) => {
      // Extract failed test cases
      if (result.failed) {
        result.failed.forEach((failedItem: any) => {
          if (typeof failedItem === 'string') {
            // If it's a string, create a default error message
            this.failed.push({
              testName: failedItem,
              errorMessage: "Test failed"
            });
          } else if (failedItem.testName && failedItem.errorMessage) {
            // If it's an object with testName and errorMessage
            this.failed.push(failedItem);
          }
        });
      }

      // Extract errors if any
      if (result.errors && result.errors.length > 0) {
        this.errors = [
          ...this.errors,
          ...result.errors.flat()
        ];
      }
    });

    // Set flags based on the availability of data
    this.failedLog = this.failed.length > 0;
    this.compilationError = this.errors.length > 0;
  }

  @ViewChild('modalContent') modalContent: ElementRef | undefined;

  openModal() {
    this.editMode = true;
    setTimeout(() => {
      this.scrollToTop();
    }, 0); // Wait for the modal to render
  }
  private scrollToTop() {
    if (this.modalContent) {
      this.modalContent.nativeElement.scrollTop = 0;
    }
  }

  cancelEdit(): void {
    this.closeModalEvent.emit();
    this.editMode = false;
  }

  SaveEdit(): void {
    this.closeModalEvent.emit();
    console.log(this.failed);
    this.dataEditedEvent.emit(this.failed); // Emit the edited data if needed
  }
}
