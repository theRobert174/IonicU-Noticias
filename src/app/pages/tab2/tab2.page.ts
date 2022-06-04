import { Component, OnInit, ViewChild } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { Article } from 'src/app/interfaces';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  constructor(private newsService : NewsService) {}

  @ViewChild( IonInfiniteScroll , {static : true} ) infiniteScroll: IonInfiniteScroll;

  public categories: string[] = ['business','entertainment','general','health','science','sports','technology'];
  public selectedCategory: string = this.categories[0];
  public articles: Article[] = [];

  ngOnInit() {
    //this.getArticles(this.selectedCategory);
    //debugger;
    this.newsService.getTopheadLinesByCategory(this.selectedCategory).subscribe(articles => {
      this.articles = [...articles]
    })
  }

  /*getArticles(category: string){
    console.log(category);
    
    this.newsService.getTopheadLinesByCategory(category).subscribe(articles => {
      this.articles = [...articles];
      console.log(this.articles);
    });
  }*/

  segmentChanged(event : Event){
    console.log(event);
    this.selectedCategory = (event as CustomEvent).detail.value;
    //this.getArticles(this.selectedCategory);
    this.newsService.getTopheadLinesByCategory(this.selectedCategory).subscribe(articles => {
      this.articles = [...articles]
    })
  }

  loadData(){
    this.newsService.getTopheadLinesByCategory( this.selectedCategory, true).subscribe(articles => {

      //Opcion para controlar el infinite scroll pero no es muy recomendata por dar un error falso
      //30 articulos de sport puede ser igual a 30 articulos en health
      if(articles.length === this.articles.length){
        this.infiniteScroll.disabled = true;
        //event.target.disabled = true;
        return;
      }

      this.articles = articles;
      this.infiniteScroll.complete();
      //event.target.complete();
    })
  }

}
