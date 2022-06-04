import { Component, OnInit, ViewChild } from '@angular/core';
import { Article } from 'src/app/interfaces';
import { NewsService } from '../../services/news.service';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  public articles : Article[] = [];
  @ViewChild(IonInfiniteScroll, { static:true }) infiniteScroll: IonInfiniteScroll;

  constructor(private newsService : NewsService) {}

  ngOnInit() {
    this.newsService.getTopHeadLines().subscribe( articles => this.articles.push( ...articles )); //... desestructuracion
  }

  loadData(){
    this.newsService.getTopheadLinesByCategory( 'business', true).subscribe(articles => {

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
