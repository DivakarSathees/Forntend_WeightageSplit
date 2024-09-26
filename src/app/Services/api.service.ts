import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // private baseUrl = "http://localhost:3000"
  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  uploadFile(file: FormData): Observable<any> {
    // localStorage.clear();
    return this.http.post<any>(`${this.baseUrl}/process-zip`,  file );
  }

  uploadTestFile(file: File, httptest: boolean): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    if (httptest)
      return this.http.post(`${this.baseUrl}/httptest`, formData);
    else
      return this.http.post(`${this.baseUrl}/model`, formData);
  }

  downloadUnitTestFile(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/downloadtest`, { responseType: 'blob' });
  }

  downloadZipFile(zip: any, type?: any): Observable<Blob> {
    console.log(zip);
    console.log(type);
    console.log(localStorage.getItem('OutputId'));

    let id;
    if (localStorage.getItem('OutputId') !== null && localStorage.getItem('OutputId') !== undefined && localStorage.getItem('OutputId')?.toString() !== '0') {
      id = localStorage.getItem('OutputId');
    } else {
      id = localStorage.getItem('karmaId');
    }
    console.log(id);
    localStorage.removeItem('OutputId');
    localStorage.removeItem('karmaId');


    if (type === undefined) {
      // return this.http.get(`${this.baseUrl}/downloadziporsh?fileName=${zip}`, { responseType: 'blob' });
      return this.http.get(`${this.baseUrl}/downloadziporsh?id=${id}`, { responseType: 'blob' });
    }
    return this.http.get(`${this.baseUrl}/downloadziporsh?fileName=${zip}&type=${type}`, { responseType: 'blob' });
  }
}
