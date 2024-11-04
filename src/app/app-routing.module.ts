import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { NunitTestcaseComponent } from './nunit-testcase/nunit-testcase.component';
import { DescriptionComponent } from './description/description.component';
import { FileExplorerComponent } from './components/file-explorer/file-explorer.component';

const routes: Routes = [
  {path:'weightage-split', component:FileUploadComponent},
  {path:'write-nunit', component:NunitTestcaseComponent},
  {path:'description', component:DescriptionComponent},
  {path:'monaco-editor/:projectType', component:FileExplorerComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
