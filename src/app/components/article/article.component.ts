import { Component, Input, OnInit } from '@angular/core';
import { Article } from 'src/app/interfaces';

import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ActionSheetController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit {

  @Input() article: Article;
  @Input() i: number;

  constructor(private iab: InAppBrowser, private platform: Platform, private actionSheetCtrl : ActionSheetController) { }

  ngOnInit() {}

  openArticle(){
    if(this.platform.is("ios") || this.platform.is('android')){
      const browser = this.iab.create(this.article.url);
      browser.show();
      return;
    }
    window.open(this.article.url, "_blank");
  }

  async onOpenMenu(){
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Compartir',
          icon: 'share-outline',
          handler: () => this.onShareArticle()
        },
        {
          text: 'Favorito',
          icon: 'heart-outline',
          handler: () => this.onToggleFavorite()
        },
        {
          text: 'Cancelar',
          icon: 'close-outline',
          role: 'cancel'
        }
      ]
    })
    await actionSheet.present();
  }

  onShareArticle(){
    console.log('OnShareArticle');
    
  }

  onToggleFavorite(){

  }

  onClick(){

  }

}
