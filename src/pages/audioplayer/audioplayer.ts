import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ITrackConstraint } from '../../components/audio-player/ionic-audio-interfaces';
import { ApiService } from '../../providers/api-service';
import { ToolService } from '../../providers/tool-service';
import { NewbieService } from '../../providers/newbie-service';
import { File } from '@ionic-native/file';
import { Constants } from '../../providers/constants'
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Network } from '@ionic-native/network';

// import { WebAudioTrack } from '../../components/audio-player/ionic-audio-web-track';
/**
 * Generated class for the AudioplayerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare let window;
window.globalAudioTack;
window.globalEvents

@IonicPage()
@Component({
  selector: 'page-audioplayer',
  templateUrl: 'audioplayer.html',
})
export class AudioplayerPage {
  currentTrack: ITrackConstraint;
  bookdatas: any = [];
  paramData :any;
  currentIndex:number = -1;

  saveItem: any = null;
  hasAddedToBookmark: boolean = false;
  curAudioFile = null;
  settings : any = null;
  loopPlayCount : number = 0;
  timeoutHandle : number = 0;
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

  volume: number;
  showVolumeControl: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,  
    private api: ApiService,
    private tool: ToolService,private app: App,
    private nbService: NewbieService,
    private storage: Storage,
    private file: File,
    private _cdRef: ChangeDetectorRef,
    private alertCtrl :AlertController,
    private network: Network,
  ) {
    this.paramData = this.navParams.data;

    for (var i=0; i<this.paramData.chapters.length; i++) {
      let chapter = this.paramData.chapters[i];
      if (chapter.chapterID === this.paramData.item.chapterID) {
        this.currentIndex = i;
        break;
      }
    }
  }

  saveToHistory(item)
  {
    this.saveItem = JSON.parse(JSON.stringify(this.paramData));
    this.saveItem.ID = this.paramData.bookitem.ID;
    this.saveItem.item = item;
    this.saveItem.progress = 0;
    this.saveItem.type = "audio";
    
    this.nbService.removeItems(NewbieService.PLAYING, [this.saveItem])
      .then(data => {
        this.nbService.saveObject(NewbieService.PLAYING, this.saveItem);
      })
      .catch(error => {});
  }

  ionViewDidLoad() {

    window.globalEvents.subscribe("web-track:onFinished", ()=>{
      this.getSettings(()=>{
        this.loopPlayCount ++;
        if (this.settings && this.settings.playingLoop === true){
          if (this.settings.stopChapter != null){
            if (parseInt(this.settings.stopChapter) > this.loopPlayCount){
              this.gotoNext(true)
            }
          }else {
            this.gotoNext(true)
          }
          
        }
      })
      
    })
    this.getSettings(()=>{
      let param = Constants.APP_TYPE == 1 ? "听书" : "读书"
      console.log(this.settings);
      if (this.network.type != 'wifi' && (this.settings && this.settings.wifiPlaying == true)) {
        this.alertCtrl.create({ // 显示下载进度
          title: "提示",
          subTitle: "当前网络状态非wifi状态，您已禁止非wifi状态"+param,
          enableBackdropDismiss: false,
          buttons: [
            { 
              text: '确定', handler:() => {
                this.app.getRootNavs()[0].pop();
              }
            },
            ]
        }).present();
        
      } else{
        this.parseParam()
        if (this.curAudioFile == null){
          this.loadAudioData()
        }
        setTimeout(() => {
          //延时一秒钟，处理seek方法
          if (this.paramData.progress != undefined){
            if (window.globalAudioTack){
              window.globalAudioTack.seekTo(this.paramData.progress)

              if (window.globalAudioTack) {
                this.volume = window.globalAudioTack.volume * 100;
              } else {
                this.volume = 0;
              }
            }
          }
        }, 500);
      }
    })
  }
  private getSettings(callback) {
    this.storage.get(`settings.${Constants.APP_TYPE}`)
    .then(data => {
      if (data) {
        this.settings = JSON.parse(data);
        if (callback){
          callback()
        }
      }
    }).catch(()=>{
      if (callback){
        callback()
      }
    });
  }
  parseParam(){
    let item = this.paramData.chapters[this.currentIndex]
    if (item) {
      this.requestParams.ID = this.paramData.bookitem.ID;
      this.requestParams.openID = this.paramData.bookitem.openID;
      this.requestParams.chapterjs = this.paramData.bookitem.chapterjs;
      this.requestParams.title = this.paramData.bookitem.title;
      this.requestParams.chapterID = item.chapterID;
      this.requestParams.chapterTitle = item.chapterTitle;
      this.requestParams.chapterHref = this.paramData.bookitem.chapterpre + item.chapterHref;
      this.requestParams.chapterServer = item.chapterServer;
      var path = this.file.documentsDirectory + this.paramData.bookitem.title + '/';
      var filename = item.chapterID + '.mp3';
      this.file.checkFile(path, filename).then((e)=>{
        if (e){
          this.curAudioFile = path + "/" + filename;
          this.currentTrack = {
            src: this.curAudioFile,
            artist: this.paramData.bookitem.title,
            title: item.chapterTitle,
            art: this.paramData.bookitem.src,
            preload: 'metadata' // tell the plugin to preload metadata such as duration for this track, set to 'none' to turn off
          }
        }
      }).catch(()=>{
        this.curAudioFile = null;
      })
      // 保存浏览历史
      this.saveToHistory(item);
    }
    
    // 判断当前是否收藏了章节
    // this.nbService.hasAdded(NewbieService.BOOKMARK_KEY, this.saveItem)
    //   .then(yesOrNo => {
    //     this.hasAddedToBookmark = yesOrNo;
    //   })
    //   .catch();
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
    // alert(JSON.stringify(this.saveItem));

    // if (this.hasAddedToBookmark) {
    //   // 删除书签
    //   this.nbService.removeItems(NewbieService.BOOKMARK_KEY, [this.saveItem])
    //     .then(data => {
    //       this.hasAddedToBookmark = false;
    //       this.tool.showToast('已移除书签');
    //     }).catch(error => {
    //       this.tool.showToast('书签删除失败');
    //     });
    // } else {
      // 新增书签
      // this.saveItem.progress = this.currentTrack.progress;

      this.nbService.addItem(NewbieService.BOOKMARK_KEY, this.saveItem)
        .then(data => {
          // this.hasAddedToBookmark = true;
          this.tool.showToast('已添加到我的书签');
        })
        .catch(error => {
          this.tool.showToast('添加书签失败');
        });
    // }
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

    this.resetStatus()
    if (this.currentIndex > 0)
    { 
      this.currentIndex = this.currentIndex - 1;
      this.parseParam()
      if (this.curAudioFile == null){
        this.loadAudioData()
      }
    }
  }

  // 下一曲
  gotoNext(autoNext : boolean): void 
  {
    console.log("-------------------"+this.currentIndex)
    if (autoNext != true){
      this.resetStatus()
    }else {
      this.loopPlayCount ++;
    }
    if (this.currentIndex < this.paramData.chapters.length - 1)
    { 
      this.currentIndex = this.currentIndex + 1;
      this.parseParam()
      if (this.curAudioFile == null){
        this.loadAudioData()
        this._cdRef.detectChanges()
      }
      
    }
  }

  playOrPause():void{
    if (window.globalAudioTack && window.globalAudioTack.isPlaying){
      this.clearStatus()
    }else{
      this.resetStatus()
    }
  }

  resetStatus(){//恢复定时状态
    clearTimeout(this.timeoutHandle)
    this.loopPlayCount = 0;
    this.getSettings(()=>{
      if (this.settings.stopTime != null){
        var arr = this.settings.stopTime.split(" ",2);
        let tt = parseInt(arr[0]) * 60 * 60 + parseInt(arr[1]) * 60
        this.timeoutHandle = setTimeout(() => {
          if (window.globalAudioTack){
            window.globalAudioTack.pause()
            // window.globalAudioTack.destroy()
            // window.globalAudioTack = null 
          }
        }, tt*1000);
      }
    });
    
  }



  clearStatus(){
    clearTimeout(this.timeoutHandle)
    this.loopPlayCount = 0;
  }

  changeVolume() {
    window.globalAudioTack.volume = this.volume / 100.0;
  }

  toggleVolumeControl() {
    this.showVolumeControl = !this.showVolumeControl;
  }

}
