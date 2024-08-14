import { inject, Injectable } from '@angular/core';
import { UIPage } from './page.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PagesBoxService {
  pages: Array<UIPage> = [];
  
  private http = inject(HttpClient);

  constructor() {
    console.log('hei');
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.get('http://localhost:5000/dev-project', {headers: headers}).subscribe(
      (value) => { console.log(value) }
    );
  }
}
