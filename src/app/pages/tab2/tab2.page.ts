import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { Article } from 'src/app/interfaces';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  constructor(private newsService : NewsService) {}

  public categories: string[] = ['business','entertainment','general','health','science','sports','technology'];
  public selectedCategory: string = this.categories[0];
  public articles: Article[] = [];

  ngOnInit() {
    this.getArticles(this.selectedCategory);
  }

  getArticles(category: string){
    this.newsService.getTopheadLinesByCategory(category).subscribe(articles => {
      this.articles = [...articles];
      console.log(this.articles);
    });
  }

  segmentChanged(event){
    console.log(event);
    this.selectedCategory = event.detail.value;
    this.getArticles(this.selectedCategory);
  }

}
