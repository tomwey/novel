import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { DomSanitizer } from "@angular/platform-browser";
import { NewbieService } from '../../providers/newbie-service';
import { ToolService } from '../../providers/tool-service';

/**
 * Generated class for the PodcastDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-podcast-detail',
  templateUrl: 'podcast-detail.html',
})
export class PodcastDetailPage {
  browser: any = {
    isLoaded: false,
    proObj: null,
    progress: 0,
    secUrl: '',
    title: '加载中',
    url: '',
  };
  currentItem: any = null;
  
  hasAdded: boolean = false;
  isPlaying: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private sanitizer: DomSanitizer,
    private app: App,
    private nbService: NewbieService,
    private tool: ToolService,
  ) {
    let browser = this.navParams.data;
    // console.log(browser);
    this.currentItem = JSON.parse(JSON.stringify(this.navParams.data.item));
    this.currentItem.save_key = this.currentItem.save_key || NewbieService.FAVORITE_KEY;
    this.currentItem._type = 'podcast';
    
    if (browser) {
      this.browser.title = browser.title;
      this.browser.url   = browser.url;
      this.browser.secUrl = this.sanitizer.bypassSecurityTrustResourceUrl(browser.url);
    } else {
      this.browser.secUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.browser.url);
    }

    this.reload();

    // 检查是否已经收藏过
    this.nbService.hasAdded(this.currentItem.save_key, this.currentItem).then(yesOrNo => {
      this.hasAdded = yesOrNo;
    }).catch();

    this.isPlaying = !!this._isPlaying();
  }

  ionViewDidLoad() {
    if (!this.browser.proObj) {
      this.browser.proObj = document.getElementById('progress');
    }

    this.onprogress();
  }

  // 生成随机数
  private random(min: number, max: number): number 
  {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // 网页访问进度
  private onprogress() {
    // 随机时间
    let timeout = this.random(10,30);

    let timer = setTimeout(() => {
      if (this.browser.isLoaded) {
        this.browser.proObj.style.width = '100%';
        clearTimeout(timer);
        return;
      }

      // 随机进度
      this.browser.progress += this.random(1,5);
     
      // 随机进度不能超过 90%, 以免页面还没加载完毕，进度已经 100% 了
      if (this.browser.progress > 90) {
        this.browser.progress = 90;
      }

      this.browser.proObj.style.width = this.browser.progress + '%';
      this.onprogress();

    }, timeout);
  }

  // 如果iframe 页面加载成功后
  loaded() {
    this.browser.isLoaded = true;
  }

  // 重新加载页面
  reload() {
    let title = this.browser.title;
    let url   = this.browser.secUrl;
    this.browser.title = '加载中';
    this.browser.secUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');

    setTimeout(() => {
      this.browser.isLoaded = false;
      this.browser.progress = 0;
      if (!this.browser.proObj) {
        this.browser.proObj = document.getElementById('progress');
      }
      this.onprogress();
      this.browser.title = title;
      this.browser.secUrl = url;
    }, 10);
  }

  _isPlaying() {
    var $statusNode = document.evaluate("//div[@class='play-btn playing']", document, null, 7, null).snapshotItem(0);
    if ($statusNode) {
      return "1";
    }
    return null;
  }

  play() {

    // if (this.isPlaying) {
    //   this.pause();
    // } else {
    //   var $playBtnNode = document.evaluate("//div[@class='cover stroke lazy']", document,null, 7, null).snapshotItem(0);
    //   if ($playBtnNode) {
    //     $playBtnNode.click();
    //     //window.setTimeout(function(){go()},1000);//1秒后执行函数go
    //     return "1";
    //   }
    // }
    
  }

  pause() {
    // var $playBtnNode = document.evaluate("//div[@class='cover stroke lazy']", document,null, 7, null).snapshotItem(0);
    // if ($playBtnNode) {
    //   $playBtnNode.click();
    //   return "1";
    // }
  }

  doFavorite() {
    if (this.hasAdded) {
      // 取消收藏
      this.nbService.removeItems(this.currentItem.save_key, [this.currentItem])
        .then(data => {
          this.hasAdded = false;
          this.tool.showToast('已取消收藏');
        })
        .catch();
    } else {
      // 收藏
      this.currentItem.save_key = NewbieService.FAVORITE_KEY;
      this.nbService.addItem(NewbieService.FAVORITE_KEY, this.currentItem)
        .then(data => {
          this.hasAdded = true;
          this.tool.showToast('收藏成功');
        })
        .catch();
    }
  }

  openVolume() {

  }

  openSettings() {
    this.app.getRootNavs()[0].push('SettingPage', { flag: 1 });
  }

}
