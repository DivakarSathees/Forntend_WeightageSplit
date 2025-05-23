import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DescriptionService {

  // private baseUrl = "http://localhost:3000"
  // private baseUrl = "https://backend-descriptiongenerator.onrender.com"
  private baseUrl = environment.baseUrl1;
  // private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  generateDescription(data: any): Observable<any> {
    console.log(data);
    return this.http.post(`${this.baseUrl}/api/descriptions/generate`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  generateSoln(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/solutions/generate`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  generateFolder(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/solutions/folderstrucure`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
}
