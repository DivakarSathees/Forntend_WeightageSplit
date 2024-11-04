import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DiffEditorModel } from 'ngx-monaco-editor';
import { DescriptionService } from '../Services/description.service';

@Component({
  selector: 'app-solution-dialog',
  templateUrl: './solution-dialog.component.html',
  styleUrls: ['./solution-dialog.component.css']
})
export class SolutionDialogComponent {
  editorOptions = { theme: 'vs-dark', language: 'json' };
  generatedSoln: string;
  options = {
    theme: 'vs-dark'
  };
  originalModel: DiffEditorModel = {
    code: 'heLLo world!',
    language: 'text/plain'
  };

  modifiedModel: DiffEditorModel = {
    code: 'hello orlando!',
    language: 'text/plain'
  };


  constructor(
    public dialogRef: MatDialogRef<SolutionDialogComponent>, private descriptionService: DescriptionService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DIALOG_DATA) public projectType: any
  ) {
    console.log(data);

    this.generatedSoln = data.solution; // Receive solution data
  }

  onCodeChange(newCode: string): void {
    this.generatedSoln = newCode;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  folderData = {
    solution:''
  }

  GenrateFolder(){

    this.folderData.solution = this.generatedSoln;
    this.descriptionService.generateFolder(this.folderData).subscribe(
      (response) => {
        console.log(response);
        if(!response?.status?.includes('bad attempt')){
        if(this.projectType.toLowerCase().includes('web') && response != undefined){
        // this.router.navigate(['/monaco-editor', 'dotnetapp']);
        window.open('/monaco-editor/dotnetapp', '_blank');
        }
        else if(this.projectType.toLowerCase().includes('java') && response != undefined){
          window.open('/monaco-editor/springapp', '_blank');
        }
        }

      },
      (error) => {
        console.error('Error generating solution:', error);
      }
    );
  }

}
