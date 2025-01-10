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
    ResultAnalyseComponent
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
    QuillModule.forRoot(),
    MonacoEditorModule.forRoot()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
