import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { Article, ArticlesByCategoryAndPage, NewsResponse } from '../interfaces';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { storedArticlesByCategory } from '../data/mock-news';

const apiUrl = environment.apiUrl;
const apiKey = environment.apiKeyNews;

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private articlesByCategoryAndPage: ArticlesByCategoryAndPage = storedArticlesByCategory;

  constructor(private http : HttpClient) { }

  //Centralizacion
  private excuteQuery<T>( endpoint : string ){
    console.log('Peticion HTTP realizada');
    return this.http.get<T>(`${apiUrl}${endpoint}`,{
      params:{
        apiKey: apiKey,
        country: 'us'
      }
    });
  }

  getTopHeadLines() : Observable<Article[]>{
    //return this.excuteQuery<NewsResponse>(`/top-headlines?category=business`).pipe( map(({articles}) => articles) );
    return this.getArticlesByCategory('business');
  }

  getTopheadLinesByCategory( category: string, loadMore: boolean = false ): Observable<Article[]> {
    return of(this.articlesByCategoryAndPage[category].articles);
    console.log(category);
    console.log(this.articlesByCategoryAndPage[category]);
    
    //Si requiere recargar mas articulos
    if( loadMore ) {
      console.log('flag 0');
      return this.getArticlesByCategory(category);
    }
    //Si vuleve hacer la consulta y ya hay articulos en memoria ... los regresa
    if( this.articlesByCategoryAndPage[category] ){
      console.log('flag 1');
      return of(this.articlesByCategoryAndPage[category].articles);
    }
    //Si no hay articulos en memoria hace la consulta
    return this.getArticlesByCategory( category );
    //return this.excuteQuery<NewsResponse>(`/top-headlines?category=${category}`).pipe( map(({articles}) => articles) );
  }


  private getArticlesByCategory( category : string ) : Observable<Article[]> {
    console.log('flag priv0');
    
    //Si la key/categoria existe en el objeto no hace nada 
    if( Object.keys(this.articlesByCategoryAndPage).includes(category) ){
      // Ya existe
      // this.articlesByCategoryAndPage[category].page += 1;
      console.log('flag priv1');
    }
    //Si no existe una key/categotia en el objeto, se inicializa un nuevo objeto en pagina 0 y articulos vacio
    else {
      // No existe
      console.log('flag priv2');
      this.articlesByCategoryAndPage[category] = {
        page: 0,
        articles: []
      }
    }

    const page = this.articlesByCategoryAndPage[category].page + 1;

    return this.excuteQuery<NewsResponse>(`/top-headlines?category=${ category }&${ page }`).pipe( map( ({articles}) => {

      if( articles.length === 0 ) return this.articlesByCategoryAndPage[category].articles;// si ya no hay mas articulos de la api, retorna los de memoria

      //Si el api regresa con mas articulos los guarda en una nueva pagina, desetructura los viejos articulos para concatenar almacenar los nuevos
      this.articlesByCategoryAndPage[category] = {
        page: page,
        articles: [ ...this.articlesByCategoryAndPage[category].articles, ...articles]
      }
      return this.articlesByCategoryAndPage[category].articles;//retorna los nuevos articulos
    } ) );
  }

}
