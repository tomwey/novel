import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { NewbieService } from '../../providers/newbie-service';
import { Events } from 'ionic-angular/util/events';
// import { CatalogPage } from '../catalog/catalog';
// import { PodcastPage } from '../podcast/podcast';
// import { SearchPage } from '../search/search';
// import { SettingPage } from '../setting/setting';
declare let window;
window.globalEvents;

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
    window.globalEvents = new Events()
    this.events.subscribe('chapter:downloading', (data) => {
      console.log(data);
      this.badge = data <= 0 ? '' : data.toString();
    });

    window.globalEvents.subscribe("web-track:onTimeUpdate", (d)=>{
      this.onUpdateTime(d)
    })
  }

  //保存音频播放数据
  onUpdateTime(duration){
    //如果正在播放音频，刷新音频播放seek
    this.nbService.getItems(NewbieService.PLAYING).then(data => {
      var saveItem = data;
      saveItem.progress = duration
      this.nbService.removeItems(NewbieService.PLAYING, [saveItem])
      .then(data => {
        this.nbService.saveObject(NewbieService.PLAYING, saveItem);
      })
      .catch(error => {});
      
    });
  }

}
