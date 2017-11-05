import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { ApiService } from '../../providers/api-service';
import { ToolService } from '../../providers/tool-service';
/**
 * Generated class for the SearchResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-result',
  templateUrl: 'search-result.html',
})
export class SearchResultPage {

  keyword: string = null;
  requestParams: any = { key: '', page: 1, ungz: 1, server: '', category: '' };
  hasMore: boolean = false;

  filterDic: any = null;
  // serverCategories: any = {};

  servers: any = [];

  categories: any = [];

  firstLoaded: boolean = false;

  dataList: any = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private app: App,
              private api: ApiService,
              private tool: ToolService,
            ) {
    this.keyword = this.navParams.data.keyword;
    this.requestParams.key = this.keyword;
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SearchResultPage');
    this.loadData();
  }

  fetchData(ev): void {
    // console.log(this.requestParams.order);
    // console.log(this.requestParams.server);
    // console.log(this.requestParams.category);
    // if (!this.firstLoad) {
      this.requestParams.page = 1;
      this.loadData();
    // }

  }

  prepareFilterData() {
    let order = this.filterDic.param1;
    let arr: any = [];
    for (let i in order) {
      arr.push(i);
    }
    this.servers = arr;
    this.requestParams.server = arr[0];

    order = this.filterDic.param2;
    let arr2: any = [];
    for (let i in order) {
      arr2.push(i);
    }
    this.categories = arr2;
    this.requestParams.category = arr2[0];
  }

  loadData(): Promise<any> {
    if (this.requestParams.page === 1) {
      this.tool.showLoading('加载中...');
    }

    return new Promise((resolve, reject) => {

        this.api.get('search.php', this.requestParams)
          .then(data => {
            
            console.log(data);

            if (this.requestParams.page === 1) {
              this.dataList = data.bookArr;

              this.filterDic = data.filterDic;
              
              if (!this.firstLoaded) {
                this.firstLoaded = true;
                this.prepareFilterData();
              }
            } else {
              let temp = this.dataList || [];
              this.dataList = temp.concat(data.bookArr);
            }
            // console.log(this.catalogList.length);
    
            this.hasMore = data.bookArr.length == 88;
    
            resolve(true);
    
            this.tool.hideLoading();
          })
          .catch(error => {
            resolve(false);
            this.tool.hideLoading();
          });
    });
    
  }

  doInfinite(e) {
    console.log("刷新界面")
    this.requestParams.page ++;
    this.loadData()
      .then(data => {
        e.complete();
      });
  }

  gotoBook(book): void {
    this.app.getRootNavs()[0].push('BookPage', book);
  }

}
