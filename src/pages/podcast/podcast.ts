import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { PodCastsService } from "../../providers/podcast-service";
import { ToolService } from "../../providers/tool-service";

/**
 * Generated class for the PodcastPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare let window;
window.globalAudioTack;

@IonicPage()
@Component({
  selector: 'page-podcast',
  templateUrl: 'podcast.html',
})
export class PodcastPage {

  dataList: any = [];
  hasMore: boolean = true;
  filterDic: any = null;
  serverCategories: any = {};

  servers: any = [];

  categories: any = [];

  firstLoaded: boolean = false;

  requestParams: any = { "openID":"e47d16be01ae009dbcdf696e62f9c1ecd5da4559", server: '', category: '', "page": 1, "ungz":1};

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private podcasts: PodCastsService,
    private tool:  ToolService,
    private app: App,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PodcastPage');
    this.loadData();
  }

  getCategories(server): void {
    // console.log(this.serverCategories);

    for (var key in this.serverCategories) {
      // console.log(key);
      // console.log(server);
      if (key === server) {
        // console.log(111);
        this.categories = this.serverCategories[key];
        // console.log(this.categories);
        console.log(this.categories);
        this.requestParams.category = this.categories[0];
        // console.log(this.requestParams.category);
        break;
      }
    }
  }

  loadData(): Promise<any> {
    if (this.requestParams.page === 1) {
      this.tool.showLoading('加载中...');
    }
    console.log(`page:${this.requestParams.page}`);

    return new Promise(resolve => {
      this.podcasts.getCategories(this.requestParams)
      .then(data => {
        console.log(data);
        // alert(data);
        data.bookArr.forEach(function (e) {
            var src = 'assets/images/icon-1.jpg,,'+e.src
            var splits = src.split(',,', 3)
            e.src = splits[splits.length - 1]
            if (e.src == 'undefined') {
              e.src = 'assets/images/icon-1.jpg'
            }           
        });
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
        // console.log(this.dataList.length);

        this.hasMore = true

        resolve(true);

        this.tool.hideLoading();
      })
      .catch(error => {
        console.log(error);
        // alert(error);
        resolve(false);

        this.tool.hideLoading();
      });
    });
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
    // let order = this.filterDic.order;
    // let arr: any = [];
    // for (let i in order) {
    //   arr.push(i);
    // }
    // this.orders = arr;
    // this.requestParams.order = arr[0];

    let serverCategory = this.filterDic.server_category;
    let arr2 = [];
    for (let server in serverCategory) {
      arr2.push(server);
      var arr3 = [];
      let obj = serverCategory[server];

      for (var key in obj['category']) {
        arr3.push(key);
      }

      this.serverCategories[server] = arr3;
    }

    this.servers = arr2;
    this.requestParams.server = arr2[0];
    // this.getCategories(arr2[0]);
  }

  doRefresh(e): void {
    this.requestParams.page = 1;
    console.log("刷新界面")
    this.loadData()
      .then(data => {
        e.complete();
      });
  }

  doInfinite(e): void {
    console.log("刷新界面")
    this.requestParams.page ++;
    this.loadData()
      .then(data => {
        e.complete();
      });
  }

  gotoPodcast(item): void{
    if (item.href == null){
      item.href = item.chapterUrlArr[0]
    }
    if (window.globalAudioTack){
      window.globalAudioTack.pause()
    }
    this.app.getRootNavs()[0].push('PodcastDetailPage', { 
      title: item.title,
      url: item.href});
  }

  showRecommended() {
    this.app.getRootNavs()[0].push('RecommendPage', { server: '推荐', category: '电台', order: '' });
  }

}
