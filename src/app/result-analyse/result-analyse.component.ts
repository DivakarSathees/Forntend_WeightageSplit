import { Component, OnInit } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TcListComponent } from '../modal/tc-list/tc-list.component';
import { MatDialog } from '@angular/material/dialog';
import { QuestionDataComponent } from '../modal/question-data/question-data.component';
import { AnalysisModalComponent } from '../modal/analysis-modal/analysis-modal.component';
import { PageEvent } from '@angular/material/paginator';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-result-analyse',
  templateUrl: './result-analyse.component.html',
  styleUrls: ['./result-analyse.component.css'],
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'translateX(0px)',
        })
      ),
      state(
        '*',
        style({
          opacity: 1,
          transform: 'translateX(0)',
        })
      ),
      transition(':enter', [animate('500ms ease-in')]),
      transition(':leave', [animate('0ms ease-out')]),
    ]),
  ],
})
export class ResultAnalyseComponent  implements OnInit {
  fileToUpload: File | null = null;
  filename: string = '';
  loading = false;
  message = '';
  downloadLink = '';
  responseinJson: any[] = [];
  paginatedData: any[] = [];
  pageSize = 5; // Default page size
  currentPage = 0; // Default to first page
  table = false
  fileId = ''
  errorMessage = ''
  processMessage = ''
  mess = false;
  authType = "credentials"
  analysisType: string = ''; // To store the selected analysis type
  email: string = ''; // For email input
  password: string = ''; // For password input
  token: string = ''; // For token input

  displayedColumns: string[] = [
    'name',
    'testId',
    'testCases',
    'questionData',
    'analysis',
    'testSubmittedTime',
    'sonarAddedTime',
    'differenceInSubmission',
  ];

  constructor(private http: HttpClient, private apiSerivce: ApiService, private dialog: MatDialog) {}

  ngOnInit() {
    // Load saved values from localStorage
    this.email = localStorage.getItem('email') || '';
    this.password = localStorage.getItem('password') || '';
    this.token = localStorage.getItem('token') || '';
    this.authType = localStorage.getItem('authType') || 'credentials';
  }

  onFileSelected(event: any): void {
    this.fileToUpload = event.target.files[0] as File;
    console.log(this.fileToUpload.name);
    this.filename = this.fileToUpload.name;
  }
  onAuthTypeChange(type: string) {
    this.authType = type;
  }

  onAnalysisTypeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.analysisType = input.value;
    console.log('Selected Analysis Type:', this.analysisType);
  }


  cancel(): void {
    // refresh the page
    window.location.reload();
  }

  showError(message: string): void {
    this.errorMessage = message;
    this.mess = true;

    // Clear the error message after 10 seconds
    setTimeout(() => {
      this.errorMessage = '';
      this.mess = false
    }, 3000); // 10000ms = 10 seconds
  }
  showProcess(message: string): void {
    this.processMessage = message;
    this.mess = true;

    // Clear the error message after 10 seconds
    setTimeout(() => {
      this.processMessage = '';
      this.mess = false
    }, 3000); // 10000ms = 10 seconds
  }

  Back(){
    this.table = false
  }
  Next(){
    this.table = true
  }

  onUpload(): void {
    localStorage.setItem('email', this.email);
    localStorage.setItem('password', this.password);
    localStorage.setItem('token', this.token);
    if (!this.fileToUpload){
      this.errorMessage = 'Please select a file before uploading.';
      this.mess = true

      setTimeout(() => {
        this.errorMessage = '';
      this.mess = false
      }, 3000); // 10 seconds
      return;
    }

      this.loading = true; // Show loading indicator when request is made
      if (this.fileToUpload) {
        const formData = new FormData();
        formData.append('file', this.fileToUpload);
        formData.append('analysisType', this.analysisType);
        formData.append('email', this.email);
        formData.append('password', this.password);
        formData.append('token', this.token);
        // Set up headers to indicate form data
        const headers = new HttpHeaders();
        headers.set('enctype', 'multipart/form-data');
        console.log(formData);

        // this.showProcess("Analysis is InProcess...");

        this.apiSerivce.uploadexcel(formData).subscribe(
          (response) => {
            this.loading = false;
            console.log('Upload successful:', response);
            this.table = true;
            this.message = response.message;
            this.downloadLink = response.downloadLink;
            this.fileId = response.fileId;
            this.responseinJson = response.responseinJson.map((item: any) => {
              if (typeof item.tcList === 'string') {
                item.tcList = JSON.parse(item.tcList); // Parse tcList if it's a string
              }
              return item;
            });
            this.updatePaginatedData();


            console.log('Parsed responseinJson:', this.responseinJson);
            // this.openResultDialog(response);


            // this.responseText = JSON.stringify(response.jsonObjects, null, 2);
            // console.log(this.responseText);

          },
          (error) => {
            console.error('Upload failed:', error.error.error);
            console.log(error.error.error);

            this.errorMessage = error.error.error;
            this.mess = true

            // setTimeout(() => {
            //   this.errorMessage = '';
            // this.mess = false
            // }, 3000);
            this.showError(this.errorMessage);

          // this.download = false;
          // this.downloadsh = false;

          //   this.responseText = 'Upload failed';
          }
        ).add(() => {
          this.loading = false; // Hide loading indicator when request completes
        });
      }
    }
    onPageChange(event: PageEvent): void {
      this.currentPage = event.pageIndex;
      this.pageSize = event.pageSize;
      this.updatePaginatedData();
    }

    updatePaginatedData(): void {
      const startIndex = this.currentPage * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.paginatedData = this.responseinJson.slice(startIndex, endIndex);
    }

    openModal(tcList: any[]): void {
      this.OpenTcListDialog(tcList);
    }
    openQuestionModal(question: any[]): void {
      this.openQuestionDialog(question);
    }
    openAnalysisModal(analysis: any[]): void {
      this.openAnalysisDialog(analysis);
    }

    OpenTcListDialog(response: any): void {
        console.log(response);

        const dialogRef = this.dialog.open(TcListComponent, {
          width: '400px',
          data: { response,testcases: response },
          // data: { testcases: response },
          // panelClass: 'custom-dialog-container', // Add a custom class for styling
        });

        dialogRef.afterClosed().subscribe((result: { testcases: any[] }) => {
          if (result) {
            // Save the changes if needed
            console.log('Testcase edited:', result);
          }
        });
        // dialogRef.componentInstance.dataEditedEvent.subscribe((editedData: any) => {
        //   console.log('Edited data:', editedData);
        //   this.responseText = JSON.stringify(editedData, null, 2);

        // });

      }

      openQuestionDialog(response: any): void {
        const dialogRef = this.dialog.open(QuestionDataComponent, {
          width: '400px',
          data: { response,testcases: response },
         });

        dialogRef.afterClosed().subscribe((result: { testcases: any[] }) => {
          if (result) {
            console.log('Testcase edited:', result);
          }
        });

      }
      openAnalysisDialog(response: any): void {
        const dialogRef = this.dialog.open(AnalysisModalComponent, {
          width: '400px',
          data: { response,testcases: response },
         });

        dialogRef.afterClosed().subscribe((result: { testcases: any[] }) => {
          if (result) {
            console.log('Testcase edited:', result);
          }
        });

      }

      downloadFile(fileId: string): void {
        this.http.get(`https://backend-projectanalyzer.onrender.com/download/${fileId}`, { responseType: 'blob' })
          .subscribe((response: Blob) => {
            // Create a temporary link element
            const url = window.URL.createObjectURL(response);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'response-analysis.xlsx';  // Set default file name
            document.body.appendChild(a);
            a.click();  // Trigger the download
            document.body.removeChild(a);  // Clean up
            window.URL.revokeObjectURL(url);  // Release the object URL
          }, error => {
            console.error('Download failed', error);
            alert('Failed to download the file.');
          });
      }




}
