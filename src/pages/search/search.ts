import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { ApiService } from '../../providers/api-service';
import { ToolService } from '../../providers/tool-service';
// import { Keyboard } from '@ionic-native/keyboard';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  searchType: string = 'hot';
  keyword: string = '';
  hotKeywords: any = [];
  searchHistories: any = [];
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private api: ApiService,
              private tool: ToolService,
              private app: App,
              // private keyboard: Keyboard,
            ) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SearchPage');
    this.loadHotKeywords();
  }

  selectKeyword(kw): void {
    console.log(kw);
    this.keyword = kw;
    
    // this.keyboard.show();
  }

  startSearch(kw): void {
    // console.log(kw);
    this.app.getRootNavs()[0].push('SearchResultPage', { keyword: kw });
  }

  // onCancel(ev) {

  // }

  loadHotKeywords(): Promise<any> {

    return new Promise((resolve => {
      this.tool.showLoading('加载中...');
      this.api.get('getHotKey.php', {ungz: 1})
        .then(data => {
          this.tool.hideLoading();
          console.log(data);
          this.hotKeywords = data.hotKeyArr;
          resolve(true);
        })
        .catch(error => {
          this.tool.hideLoading();
          resolve(false);
        })
    }));
  }

  doRefresh(refresher): void {
    this.loadHotKeywords().then(data => {
      if (refresher)
        refresher.complete();
    })
  }

  getItems(event): void {

  }

}
