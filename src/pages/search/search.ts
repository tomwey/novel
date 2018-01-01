import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { ApiService } from '../../providers/api-service';
import { ToolService } from '../../providers/tool-service';
import { SearchService } from '../../providers/search-service';
import { GlobalPlayService } from '../../providers/global-play-service';
import { Searchbar } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';

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

  @ViewChild('searchBar') searchBar: Searchbar;

  searchType: string = 'hot';
  keyword: string = '';
  hotKeywords: any = [];
  searchHistories: any = [];
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private api: ApiService,
              private tool: ToolService,
              private app: App,
              private searchService: SearchService,
              public globalService: GlobalPlayService,
              private keyboard: Keyboard,
            ) {
    this.loadSearchKeywords();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SearchPage');
    this.loadHotKeywords();
  }

  loadSearchKeywords(refresher = null): void {
    this.searchService.getKeywords().then(data => {
      this.searchHistories = data;
      if (refresher) {
        refresher.complete();
      }
    }).catch((error => {
      if (refresher) {
        refresher.complete();
      }
    }));
  }

  selectKeyword(kw): void {
    console.log(kw);
    this.keyword = kw;
  }

  startSearch(kw): void {
    // console.log(kw);
    this.app.getRootNavs()[0].push('SearchResultPage', { keyword: kw });

    if (!!kw) {
      this.searchService.addKeyword(kw).then(data => {
        this.loadSearchKeywords();
      }).catch();
    }
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
    if (this.searchType === 'hot') {
      this.loadHotKeywords().then(data => {
        if (refresher)
          refresher.complete();
      })
    } else {
      this.loadSearchKeywords(refresher);
    }
    
  }

}
