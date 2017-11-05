import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { ITrackConstraint } from '../../components/audio-player/ionic-audio-interfaces';
import { ApiService } from '../../providers/api-service';
import { ToolService } from '../../providers/tool-service';
// import { WebAudioTrack } from '../../components/audio-player/ionic-audio-web-track';
/**
 * Generated class for the AudioplayerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare let window;
window.globalAudioTack;

@IonicPage()
@Component({
  selector: 'page-audioplayer',
  templateUrl: 'audioplayer.html',
})
export class AudioplayerPage {
  currentTrack: ITrackConstraint;
  bookdatas: any = [];
  paramData :any;
  currentIndex:number;
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

  constructor(public navCtrl: NavController, public navParams: NavParams,  private api: ApiService,
    private tool: ToolService,private app: App) {
    this.paramData = this.navParams.data;
    this.currentIndex = this.paramData.chapters.indexOf(this.paramData.item) 
    console.log(this.paramData);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AudioplayerPage');
    console.log(window.globalAudioTack)
    this.parseParam()
    this.loadAudioData()
    console.log("加载数据！！！");
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
  }

  loadAudioData(): Promise<any> {
    return new Promise((resolve => {
      this.tool.showLoading('加载中...');
      this.api.get('getChapter.php', this.requestParams)
        .then(data => {
          this.tool.hideLoading();
          console.log(data);
          
          this.currentTrack = {
            src: data.chapterSrcArr[0],
            artist: data.title,
            title: data.chapterTitle,
            art: this.paramData.bookitem.src,
            preload: 'metadata' // tell the plugin to preload metadata such as duration for this track, set to 'none' to turn off
          }
          
          resolve(true);
        })
        .catch(error => {
          this.tool.hideLoading();
          resolve(false);
        })
    }));
  }

  // 添加书签
  addBookmark(): void 
  {

  }

  // 打开章节
  openChapters(): void 
  {
    this.app.getRootNavs()[0].pop();
  }

  // 打开设置
  openSettings(): void 
  {
    this.app.getRootNavs()[0].push('SettingPage', { flag: 1 });
  } 

  // 上一曲
  gotoPrev(): void 
  {
    if (this.currentIndex > 0)
    { 
      this.currentIndex = this.currentIndex - 1;
      this.parseParam()
      this.loadAudioData()
    }
  }

  // 下一曲
  gotoNext(): void 
  {
    console.log("-------------------"+this.currentIndex)
    if (this.currentIndex < this.paramData.chapters.length - 1)
    { 
      this.currentIndex = this.currentIndex + 1;
      this.parseParam()
      this.loadAudioData()
      
    }
  }

}
