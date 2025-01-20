import { Component, Input } from '@angular/core';
import hljs from 'highlight.js';

@Component({
  selector: 'app-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.css']
})
export class FileTreeComponent {
  @Input() data: any[] = [];
  @Input() stack: any[] = [];
  selectedFile: any = null;
  back = true
  isModalOpen: boolean = false;
  currentPath: string[] = [];  // Keeps track of the current path of directories



  // Toggle directory open/close
  toggleDirectory(item: any): void {
    console.log(item);

    item.isOpen = !item.isOpen;
    console.log(this.data);

    this.currentPath.push(item.name);  // Add the current directory to the path
    this.selectFile(null);
    // If it's a directory that is being opened, push it to the stack
    if (item.isOpen) {
    console.log(this.stack);

      this.stack.push(item); // Add the directory to the stack
      this.back = true;
    }
    console.log(this.stack);

  }

  // Select a file to display its code
  selectFile(file: any): void {
    this.selectedFile = file;
  }

  // Handle the back button click
  toggleBackDirectory(): void {

this.back=false

    // this.data[0].isOpen = false;


  }
  toggleDirectoryNavigation(item: any) {
    this.currentPath.push(item.name);  // Add the current directory to the path
    this.selectFile(null);             // Clear selected file when navigating to a directory
  }

  // This function is used to go back to the previous directory
  navigateBack() {
    this.currentPath.pop();           // Remove the last directory from the path
    this.selectFile(null);            // Clear selected file when going back
  }
}
