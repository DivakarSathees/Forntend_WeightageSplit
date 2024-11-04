import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileItem[];
}
@Injectable({
  providedIn: 'root'
})
export class FileExplorerService {
  private apiUrl = 'https://backend-descriptiongenerator.onrender.com/api/solutions';

  constructor(private http: HttpClient) {}

  getFiles(projectType: any): Observable<FileItem[]> {
    const params = new HttpParams().set('path', `D:/description/OutputSolution/${projectType}`);
console.log(params);

    return this.http.get<FileItem[]>(`${this.apiUrl}/api/files`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: params
    });
  }


  getFileContent(filePath: string): Observable<{ content: string }> {
    return this.http.get<{ content: string }>(`${this.apiUrl}/api/file-content`, {
      params: { path: filePath }
    });
  }

  saveFileContent(path: any, content: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/saveFileContent`, { path, content }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

}
