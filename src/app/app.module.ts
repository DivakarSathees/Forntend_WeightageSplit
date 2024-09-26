import { NgModule } from '@angular/core';
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


@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    JsonViewerComponent,
    NavbarComponent,
    NunitTestcaseComponent,
    ResultDialogComponent
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
    AngularEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
