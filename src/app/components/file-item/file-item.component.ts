import { Component, Input, Output, EventEmitter } from '@angular/core';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  path: string;
  open?: boolean;
  children?: FileItem[];
}
@Component({
  selector: 'app-file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.css']
})
export class FileItemComponent {
  @Input() file!: FileItem;
  @Output() fileSelected = new EventEmitter<FileItem>();

  toggleFolder(): void {
    if (this.file.type === 'folder') {
      this.file.open = !this.file.open;
    }
  }

  selectFile(): void {
    if (this.file.type === 'file') {
      this.fileSelected.emit(this.file);
    }
  }
}
