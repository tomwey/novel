import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { ApiService } from '../../providers/api-service';
import { ToolService } from '../../providers/tool-service';
import { NewbieService } from '../../providers/newbie-service';

/**
 * Generated class for the BookViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-book-view',
  templateUrl: 'book-view.html',
})
export class BookViewPage {

  bookdatas: any = [];
  paramData :any;
  currentIndex:number;
  saveItem: any = null;
  requestParams: any = { 
      openID:"e47d16be01ae009dbcdf696e62f9c1ecd5da4559",//设备唯一标识，可随意填一个
      isPlay : "1",
      chapterID : "ccc51fbfe2b4f5d2fd7804d0ba3d0083",
      chapterTitle : "[第003集]",
      title : "借命",
      chapterjs : "",
      chapterHref : "http:\/\/www.ysts8.com\/Yshtml\/Ys22483.html?vid=AGJ6AWV7BnFdNDUoNWZ4ATQqATB7LGAoMqQnLDNcADMpMDIsMWF8LJ7,,url=http:\/\/www.ysts8.com\/down_22483_50_1_3.html",
      chapterServer : "44c29edb103a2872f519ad0c9a0fdaaa",
      ID : "41f33a237e4af3435ba53c3d308a8cdf",
      ungz: 1
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private api: ApiService,
    private tool: ToolService,private app: App,
    private nbService:NewbieService
  ) {
    this.paramData = this.navParams.data;
    this.currentIndex = this.paramData.chapters.indexOf(this.paramData.item) 
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad BookViewPage');
    this.parseParam();
    this.loadData();
  }

  parseParam(){
    let item = this.paramData.chapters[this.currentIndex]
    this.requestParams.ID = this.paramData.bookitem.ID;
    this.requestParams.openID = this.paramData.bookitem.openID;
    this.requestParams.chapterjs = this.paramData.bookitem.chapterjs;
    this.requestParams.title = this.paramData.bookitem.title;
    this.requestParams.chapterID = item.chapterID;
    this.requestParams.chapterTitle = item.chapterTitle;
    this.requestParams.chapterHref = this.paramData.bookitem.chapterpre + item.chapterHref;
    this.requestParams.chapterServer = item.chapterServer;
    this.saveItem(item)
  }

  saveToHistory(item)
  {
    this.saveItem = JSON.parse(JSON.stringify(this.paramData));
    this.saveItem.ID = this.paramData.bookitem.ID;
    this.saveItem.item = item;
    this.saveItem.progress = 0;
    this.saveItem.type = "read";
    
    this.nbService.removeItems(NewbieService.HISTORY_KEY, [this.saveItem])
      .then(data => {
        this.nbService.addItem(NewbieService.HISTORY_KEY, this.saveItem);
      })
      .catch(error => {});
  }


  loadData(): Promise<any> {
    return new Promise((resolve => {
      this.tool.showLoading('加载中...');
      this.api.get('getChapter.php', this.requestParams)
        .then(data => {
          this.tool.hideLoading();
          console.log(data);
          
          resolve(true);
        })
        .catch(error => {
          this.tool.hideLoading();
          resolve(false);
        })
    }));
  }

}
