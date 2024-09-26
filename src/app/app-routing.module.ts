import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { NunitTestcaseComponent } from './nunit-testcase/nunit-testcase.component';

const routes: Routes = [
  {path:'weightage-split', component:FileUploadComponent},
  {path:'write-nunit', component:NunitTestcaseComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
