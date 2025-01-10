import { Component } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-result-analyse',
  templateUrl: './result-analyse.component.html',
  styleUrls: ['./result-analyse.component.css']
})
export class ResultAnalyseComponent {
  fileToUpload: File | null = null;
  filename: string = '';
  loading = false;
  message = '';
  downloadLink = '';
  responseinJson: any[] = [];
  constructor(private http: HttpClient, private apiSerivce: ApiService) {}

  onFileSelected(event: any): void {
    this.fileToUpload = event.target.files[0] as File;
    console.log(this.fileToUpload.name);
    this.filename = this.fileToUpload.name;
  }

  cancel(): void {
    // refresh the page
    window.location.reload();
  }

  onUpload(): void {
      this.loading = true; // Show loading indicator when request is made
      if (this.fileToUpload) {
        const formData = new FormData();
        formData.append('file', this.fileToUpload);
        // Set up headers to indicate form data
        const headers = new HttpHeaders();
        headers.set('enctype', 'multipart/form-data');
        console.log(formData);

        this.apiSerivce.uploadexcel(formData).subscribe(
          (response) => {
            this.loading = false;
            console.log('Upload successful:', response);
            this.message = response.message;
            this.downloadLink = response.downloadLink;
            this.responseinJson = response.responseinJson.map((item: any) => {
              if (typeof item.tcList === 'string') {
                item.tcList = JSON.parse(item.tcList); // Parse tcList if it's a string
              }
              return item;
            });

            console.log('Parsed responseinJson:', this.responseinJson);
            // this.openResultDialog(response);


            // this.responseText = JSON.stringify(response.jsonObjects, null, 2);
            // console.log(this.responseText);

          },
          (error) => {
            console.error('Upload failed:', error);
          // this.download = false;
          // this.downloadsh = false;

          //   this.responseText = 'Upload failed';
          }
        ).add(() => {
          this.loading = false; // Hide loading indicator when request completes
        });
      }
    }



}
