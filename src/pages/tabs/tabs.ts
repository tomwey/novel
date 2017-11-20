import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { NewbieService } from '../../providers/newbie-service';
import { Events } from 'ionic-angular/util/events';
declare let window;
window.globalAudioTack;
// import { CatalogPage } from '../catalog/catalog';
// import { PodcastPage } from '../podcast/podcast';
// import { SearchPage } from '../search/search';
// import { SettingPage } from '../setting/setting';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = 'CatalogPage';
  tab3Root = 'PodcastPage';
  tab4Root = 'SearchPage';
  tab5Root = 'SettingPage';

  badge: string = '';

  constructor(private nbService: NewbieService,
    private events: Events,
  ) {
    document.addEventListener("ontimeupdate", ()=>{
      this.ontimer()
    })

    this.events.subscribe('chapter:downloading', (data) => {
      console.log(data);
      this.badge = data <= 0 ? '' : data.toString();
    });
  }

  //保存音频播放数据
  ontimer(){
    console.log("应用进入后台事件")
    //如果正在播放音频，刷新音频播放seek
    this.nbService.getItems(NewbieService.HISTORY_KEY).then(data => {
      var saveItem = data;
      if (window.globalAudioTack){
        saveItem.progress = window.globalAudioTack.current
        this.nbService.removeItems(NewbieService.HISTORY_KEY, [saveItem])
        .then(data => {
          this.nbService.addItem(NewbieService.HISTORY_KEY, saveItem);
        })
        .catch(error => {});
      }
    });
  }

}
