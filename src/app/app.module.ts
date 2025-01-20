import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { JsonViewerComponent } from './json-viewer/json-viewer.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NavbarComponent } from './navbar/navbar.component';
import { NunitTestcaseComponent } from './nunit-testcase/nunit-testcase.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResultDialogComponent } from './result-dialog/result-dialog.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DescriptionComponent } from './description/description.component';
import { SolutionDialogComponent } from './solution-dialog/solution-dialog.component';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { FileItemComponent } from './components/file-item/file-item.component';
import { FileExplorerComponent } from './components/file-explorer/file-explorer.component';
import { QuillModule } from 'ngx-quill';
import { ResultAnalyseComponent } from './result-analyse/result-analyse.component';
import { TcListComponent } from './modal/tc-list/tc-list.component';
import { QuestionDataComponent } from './modal/question-data/question-data.component';
import { AnalysisModalComponent } from './modal/analysis-modal/analysis-modal.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { LogListComponent } from './modal/log-list/log-list.component';
import { SolutionModalComponent } from './modal/solution-modal/solution-modal.component';
import { FileTreeComponent } from './components/file-tree/file-tree.component';

@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    JsonViewerComponent,
    NavbarComponent,
    NunitTestcaseComponent,
    ResultDialogComponent,
    DescriptionComponent,
    SolutionDialogComponent,
    FileItemComponent,
    FileExplorerComponent,
    ResultAnalyseComponent,
    TcListComponent,
    QuestionDataComponent,
    AnalysisModalComponent,
    LogListComponent,
    SolutionModalComponent,
    FileTreeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxJsonViewerModule,
    NgxDropzoneModule,
    BrowserAnimationsModule,
    MatDialogModule,
    AngularEditorModule,
    MatListModule,
    MatIconModule,
    MatTabsModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatTableModule,
    QuillModule.forRoot(),
    MonacoEditorModule.forRoot()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
