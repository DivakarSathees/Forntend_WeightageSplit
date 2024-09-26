import { Component } from '@angular/core';
import { ApiService } from '../Services/api.service';

@Component({
  selector: 'app-nunit-testcase',
  templateUrl: './nunit-testcase.component.html',
  styleUrls: ['./nunit-testcase.component.css']
})
export class NunitTestcaseComponent {
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  writeTestCasesOnHttptest: boolean = false;
  download: boolean = false;
  filename: boolean = false;
  desc: string = '';
  editorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '100px',
    placeholder: 'Enter text here...',
    translate: 'no',
    enableToolbar: true,
    showToolbar: true,
    toolbar: [
      ['bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'subscript'],
      ['fontName', 'fontSize', 'color'],
      ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent'],
      ['cut', 'copy', 'delete', 'removeFormat', 'undo', 'redo'],
      ['paragraph', 'blockquote', 'removeBlockquote', 'horizontalLine', 'orderedList', 'unorderedList'],
      ['link', 'unlink', 'image', 'video']
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    sanitize: true,
    TextDecoder: false,

  };
  constructor(private fileService: ApiService) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File;
    console.log(this.selectedFile.name);
    if (this.selectedFile.name != null) {
      this.filename=true;
      this.selectedFileName = this.selectedFile.name;
    } else {
      this.filename = false;
      this.selectedFileName = 'No file selected';
    }

  }

  uploadFile(): void {
    console.log("check"+this.writeTestCasesOnHttptest);

    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.fileService.uploadTestFile(this.selectedFile, this.writeTestCasesOnHttptest).subscribe(
        (data) => {
          console.log('File uploaded successfully');
          console.log(data[1].descriptions[0].description.message.content);
          this.desc = data[1].descriptions.map((desc: { description: { message: { content: any; }; }; className: any; }) => `${desc.className}: \n${desc.description.message.content}`).join('\n\n');
//           this.desc = data[1].descriptions.map((desc: { description: { message: { content: any; }; }; className: any; }) => `${desc.className}: ${desc.description.message.content}`)
// .map((desc: string) => this.escapeHtml(desc))
// .join('\n');


          this.download = true;
        },
        (error) => {
          console.error('Error uploading file:', error);
          this.download = false;
        }
      );
    }
  }
  // escapeHtml(unsafe: string) {
  //   return unsafe
  //        .replace(/&/g, "&amp;")
  //        .replace(/</g, "&lt;")
  //        .replace(/>/g, "&gt;")
  //        .replace(/"/g, "&quot;")
  //        .replace(/'/g, "&#039;");
  // }



  downloadFile(): void {
    this.fileService.downloadUnitTestFile().subscribe(
      (data: Blob) => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'UnitTest1.cs';
        anchor.click();
        this.download = false;
        this.filename = false;
      },
      (error) => {
        console.error('Error downloading file:', error);
      }
    );
  }
}
