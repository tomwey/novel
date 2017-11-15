import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events, App } from 'ionic-angular';
import { Constants } from './constants';
import { NewbieService } from './newbie-service';

@Injectable()
export class GlobalPlayService {
  
  constructor(private store: Storage, 
              private events: Events,
              private app: App,
              private nbService:NewbieService
            ) {
    // console.log('Hello ToolService Provider');
  }

  getPlayButton(): string {
    if (Constants.APP_TYPE === 1) {
      return '播放中';
    }

    if (Constants.APP_TYPE === 2) {
      return '阅读中';
    }

    return '';
  }

  gotoPlay() {
    // alert(123);
    this.nbService.getItems(NewbieService.HISTORY_KEY).then(data => {
      if (data.type == "audio"){
        this.app.getRootNavs()[0].push('AudioplayerPage', data);
      }else if (data.type == "podcast"){
        this.app.getRootNavs()[0].push('PodcastDetailPage', data);
      }else if (data.type == "read"){
        this.app.getRootNavs()[0].push('BookViewPage', data);
      }
    }).catch(()=>{

    })
  }

}
