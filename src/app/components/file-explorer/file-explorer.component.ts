import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileExplorerService } from 'src/app/Services/file-explorer.service';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  path: string;
  open?: boolean;
  children?: FileItem[];
}

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})
export class FileExplorerComponent {
  // files: FileItem[] = [
  //   { name: 'index.html', type: 'file' },
  //   {
  //     name: 'components',
  //     type: 'folder',
  //     open: false,
  //     children: [
  //       { name: 'app.component.ts', type: 'file' },
  //       { name: 'app.component.html', type: 'file' }
  //     ]
  //   }
  // ];

  // toggleFolder(file: FileItem) {
  //   if (file.type === 'folder') {
  //     file.open = !file.open;
  //   }
  // }

  files: FileItem[] = [];
  selectedFileContent: string | null = null;
  editorOptions = { theme: 'vs-dark', language: 'csharp' };
  code = 'console.log("Hello, world!");';
  projectType: string | null = null;

  // onCodeChange(newCode: string) {
  //   this.code = newCode;
  // }
  constructor(private fileExplorerService: FileExplorerService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projectType = params['projectType'];
      console.log(this.projectType); // Use projectType as needed
    });
    this.fetchFiles();
  }

  fetchFiles(): void {
    this.fileExplorerService.getFiles(this.projectType).subscribe(
      (data) => (this.files = data),
      (error) => console.error('Error fetching files:', error)
    );
  }

  toggleFolder(folder: FileItem): void {
    folder.open = !folder.open;
  }

  // showFileContent(file: FileItem): void {
  //   this.fileExplorerService.getFileContent(file.path).subscribe(
  //     (data) => (this.selectedFileContent = data.content),
  //     (error) => console.error('Error reading file content:', error)
  //   );
  // }
  activeTab: string | null = null;
  filePath: string | null = null;

  showFileContent(file: FileItem): void {
    // Mock file content fetching
    this.fileExplorerService.getFileContent(file.path).subscribe(
      (data) => {
        this.selectedFileContent = data.content; // Assuming the data contains 'content'
        this.activeTab = file.name; // Set the active tab to the selected file
        this.filePath = file.path
        console.log(this.activeTab);
        console.log(this.filePath);

      },
      (error) => console.error('Error reading file content:', error)
    );
  }
  findFileByName(name: string, files: any[]): any | undefined {
    for (let file of files) {
      if (file.name === name) {
        return file;
      }
      // Check if file has subfolders, then search recursively
      if (file.subfolders && file.subfolders.length > 0) {
        const found = this.findFileByName(name, file.subfolders);
        if (found) return found;
      }
    }
    return undefined; // Return undefined if the file is not found
  }

  onCodeChange(newCode: string): void {
    this.selectedFileContent = newCode;
    console.log(newCode);

    if (this.activeTab) {
      console.log(this.activeTab);
      console.log(this.files);


      // const file = this.files.find(f => f.name === this.activeTab);
      const file = this.findFileByName(this.activeTab, this.files);

      console.log(file);

      // if (file) {
        this.saveFileContent();
      // }
    }
  }

  saveFileContent(): void {
    if (this.selectedFileContent) {
      this.fileExplorerService.saveFileContent(this.filePath, this.selectedFileContent).subscribe(
        () => console.log(`File ${this.filePath} saved successfully.`),
        (error) => console.error(`Error saving file ${this.filePath}:`, error)
      );
    }
  }

  downloadFile() {
    const fileName = 'dotnetapp.zip'; // Replace with dynamic input if needed
    this.fileExplorerService.downloadFile().subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Download failed:', error);
      }
    );
  }
}
