import { Component, Input, OnInit } from '@angular/core';
import { Article } from 'src/app/interfaces';

import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { ActionSheetButton, ActionSheetController, Platform } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit {

  @Input() article: Article;
  @Input() i: number;

  constructor(private iab: InAppBrowser, private platform: Platform, private actionSheetCtrl : ActionSheetController, private socialSharing: SocialSharing, private storageService: StorageService) { }

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

    const normalBtns: ActionSheetButton[] = [
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

    const shareBtn: ActionSheetButton = {
      text: 'Compartir',
      icon: 'share-outline',
      handler: () => this.onShareArticle()
    };

    if(this.platform.is('capacitor')){
      normalBtns.unshift(shareBtn);
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones',
      buttons: normalBtns
    })
    await actionSheet.present();

    
  }

  onShareArticle(){
    //console.log('OnShareArticle');
    const { title, source, url } = this.article
    this.socialSharing.share(
      title,
      source.name,
      null,
      url
    );
  }

  onToggleFavorite(){
    this.storageService.saveRemoveArticle(this.article);
  }

  onClick(){

  }

}
