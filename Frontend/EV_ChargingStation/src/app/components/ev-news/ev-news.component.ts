import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';


interface EVNews {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  datePublished: string;
}

@Component({
  selector: 'app-ev-news',
  imports: [CommonModule,HeaderComponent],
  templateUrl: './ev-news.component.html',
  styleUrl: './ev-news.component.scss'
})
export class EvNewsComponent implements OnInit {
  newsList: EVNews[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<EVNews[]>('http://localhost:8080/api/news').subscribe(
      (data) => {
        this.newsList = data;
      },
      (error) => {
        console.error('Error fetching EV news:', error);
      }
    );
  }
}
