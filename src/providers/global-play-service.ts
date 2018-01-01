import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events, App } from 'ionic-angular';
import { Constants } from './constants';
import { NewbieService } from './newbie-service';
import { ToolService } from './tool-service';

@Injectable()
export class GlobalPlayService {
  
  constructor(private store: Storage, 
              private events: Events,
              private app: App,
              private nbService:NewbieService,
              private tool : ToolService
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
    if (Constants.APP_TYPE == 1){
      console.log("----------------playing---------------")
      this.nbService.getItems(NewbieService.PLAYING).then(data => {
        // console.log(data)
        let item = data[0];
        if (item.type == "audio"){
          this.app.getRootNavs()[0].push('AudioplayerPage', item);
        }else if (item.type == "podcast"){
          this.app.getRootNavs()[0].push('PodcastDetailPage', item);
        }else {
          this.tool.showToast('没有历史记录');
        }
      }).catch(()=>{
        this.tool.showToast('没有历史记录');
      })
    }else if (Constants.APP_TYPE === 2) {
      console.log("----------------reading---------------")
      this.nbService.getItems(NewbieService.HISTORY_KEY).then(data => {
        let item = data[0];
        if (item.type == "read"){
          this.app.getRootNavs()[0].push('BookViewPage', data[0]);
        }else {
          this.tool.showToast('没有历史记录');
        }
      }).catch(()=>{
        this.tool.showToast('没有历史记录');
      })
    }
  }

}
