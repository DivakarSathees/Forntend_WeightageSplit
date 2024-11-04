import { Component } from '@angular/core';
import { DescriptionService } from '../Services/description.service';
import { MatDialog } from '@angular/material/dialog';
import { SolutionDialogComponent } from '../solution-dialog/solution-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent {
  descriptionData = {
    projectType: '',
    complexity: '',
    technology: '',
    relationship: '',
    entityCount: '',
    operations: '',
    topic: ''
  };

  solnData ={
    description:''
  }

  folderData = {
    solution:''
  }


  generatedDescription: string = '';
  generatedSoln: string = '';

  constructor(private descriptionService: DescriptionService, private dialog: MatDialog, private router: Router) {}

  onSubmit() {
    this.descriptionService.generateDescription(this.descriptionData).subscribe(
      (response) => {
        console.log(response);

        this.generatedDescription = response.description.content;

      },
      (error) => {
        console.error('Error generating description:', error);
      }
    );
  }

  GenrateSoln(){
    this.solnData.description = this.generatedDescription;
    this.descriptionService.generateSoln(this.solnData).subscribe(
      (response) => {
        console.log(response);

        this.generatedSoln = response.Solution.content;
        this.openSolutionDialog(this.generatedSoln,this.descriptionData.projectType ); // Open dialog with generated solution
      },
      (error) => {
        console.error('Error generating solution:', error);
      }
    );
  }

  GenrateFolder(){

    this.folderData.solution = this.generatedSoln;
    this.descriptionService.generateFolder(this.folderData).subscribe(
      (response) => {
        console.log(response);
        if(!response?.status?.includes('bad attempt')){
        if(this.descriptionData.projectType.toLowerCase().includes('web') && response != undefined){
        // this.router.navigate(['/monaco-editor', 'dotnetapp']);
        window.open('/monaco-editor/dotnetapp', '_blank');
        }
        else if(this.descriptionData.projectType.toLowerCase().includes('java') && response != undefined){
          window.open('/monaco-editor/springapp', '_blank');
        }
        }

      },
      (error) => {
        console.error('Error generating solution:', error);
      }
    );
  }
  openSolutionDialog(solution: string, projectType: string) {
    this.dialog.open(SolutionDialogComponent, {
      width: '80%',
      data: { solution: solution, projectType: projectType }
    });
  }
}
