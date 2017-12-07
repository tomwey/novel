import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { GlobalPlayService } from '../../providers/global-play-service';
import { ApiService } from '../../providers/api-service';
import { ToolService } from '../../providers/tool-service';
import { Constants } from '../../providers/constants';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Device } from '@ionic-native/device';
import { Clipboard } from '@ionic-native/clipboard';
import { Storage } from '@ionic/storage';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Events } from 'ionic-angular/util/events';
import { NewbieService } from '../../providers/newbie-service';

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  flag: boolean = false;
  moreApps: any = [];
  appVersion: string = Constants.APP_VERSION;

  // wifiDownloaded: boolean = false;
  // wifiPlaying: boolean    = false;
  // playingLoop: boolean    = true;
  settings: any = {
    stopTime: null,
    stopChapter: null,
    playingLoop: true,
    allowLineControl: true,
    pauseWhenOut: false,
    wifiPlaying: false,
    wifiDownloading: false,
    useFanti: false,
  };

  notifyBadge: number = 0;
  // customMenus: any = [];
  favoritedItems: any = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public globalService: GlobalPlayService,
    private app: App,
    private api: ApiService,
    private tool: ToolService,
    private device: Device,
    private alertCtrl: AlertController,
    private clipboard: Clipboard,
    private storage: Storage,
    private modalCtrl: ModalController,
    private iab: InAppBrowser,
    private events: Events,
    private nbService: NewbieService,
  ) {
    this.flag = this.navParams.data.flag && this.navParams.data.flag === 1;

    this.getSettings();

    this.events.subscribe('favorites:changed2', () => {
      this.loadFavoritedItems();
    });

    this.loadFavoritedItems();
  }

  private loadFavoritedItems() {
    this.favoritedItems = [];
    this.nbService.getMenues().then(data => {
      // let s = '';
      let promises = [];
      data.forEach(element => {
        if (element.id === NewbieService.FAVORITE_KEY || 
            element.custom) {
              // s += element.id;
              promises.push(this.nbService.getItems(element.id)
                .then(res => {
                  // alert(data)
                  // alert(JSON.stringify(res));
                  this.favoritedItems = this.favoritedItems.concat(res);
                }));
            }
      });
      Promise.all(promises).then(() => {
        let total = 0;
        this.favoritedItems.forEach(item => {
          if (item.notify === true) {
            total++;
          }
        });
        this.notifyBadge = total;
        // alert(JSON.stringify(this.favoritedItems));
      });
      
    });
  }

  private getSettings() {
    this.storage.get(`settings.${Constants.APP_TYPE}`)
    .then(data => {
      if (data) {
        this.settings = JSON.parse(data);
      }
    });
  }

  saveSettings() {
    this.storage.set(`settings.${Constants.APP_TYPE}`, JSON.stringify(this.settings));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');

    this.loadMoreApp();
  }

  loadMoreApp() 
  {
    this.tool.showLoading('加载中...');

    this.api.get2('asdf/more.php', {
      openID: 'e47d16be01ae009dbcdf696e62f9c1ecd5da4559',
      ungz: 1,
      VID: this.getAppVersionInfo(),
      name: Constants.APP_NAME,
    })
    .then(data => {
      this.tool.hideLoading();

      this.moreApps = data;
    })
    .catch(error => {
      this.tool.hideLoading();
    });
  }

  getAppVersionInfo(): string {
    return 'app_' + Constants.APP_VERSION;
  }

  getRequestParams(): any {
    var now = new Date();
    
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日

    return {
      openID: 'e47d16be01ae009dbcdf696e62f9c1ecd5da4559',
      ungz: 1,
      VID: this.getAppVersionInfo(),
      name: Constants.APP_NAME,
      OSV: this.device.version,
      PID: `${year}${month}${day}`,
    };
  }

  checkVersion()
  {
    this.tool.showLoading('加载中...');

        this.api.get2('asdf/upgrade.php', this.getRequestParams())
        .then(data => {
          this.tool.hideLoading();
          
          if (data.downloadUrl) {
            this.alertCtrl.create({ // 显示下载进度
              title: data.title,
              subTitle: data.msg,
              enableBackdropDismiss: false,
              buttons: [
                { 
                  text: '取消', handler:() => {}
                },
                {
                text: '更新', handler: () => {
                  // window.open(data.downloadUrl);
                  this.openUrl(data.downloadUrl);
                }
              }]
            }).present();
          } else {
            // 没有新版本
            setTimeout(() => {
              this.tool.showToast(data.txt);
            }, 100);
          }
          console.log(data);
          // this.moreApps = data;
        })
        .catch(error => {
          this.tool.hideLoading();
          setTimeout(() => {
            this.tool.showToast('获取版本信息失败');
          }, 100);
        });
  }

  setPassword() {
    this.modalCtrl.create('PasswordPage').present();
  }

  sendNotify() {
    this.app.getRootNavs()[0].push('BookUpdatePage', this.favoritedItems);
  }

  rateus() {
    this.tool.showLoading('加载中...');
    var now = new Date();
    
     var year = now.getFullYear();       //年
     var month = now.getMonth() + 1;     //月
     var day = now.getDate();            //日

        this.api.get2('asdf/upgrade.php', {
          openID: 'e47d16be01ae009dbcdf696e62f9c1ecd5da4559',
          ungz: 1,
          VID: this.getAppVersionInfo(),
          name: Constants.APP_NAME,
          OSV: this.device.version,
          PID: `${year}${month}${day}`,
          isShare: 1,
        })
        .then(data => {
          this.tool.hideLoading();
          // alert(data.downloadUrl);
          if (data.downloadUrl) {
            // window.open(data.downloadUrl);
            this.openUrl(data.downloadUrl);
          }
        })
        .catch(error => {
          this.tool.hideLoading();
          setTimeout(() => {
            this.tool.showToast('获取数据失败');
          }, 100);
        });
  }

  doShare()
  {
    this.tool.showLoading('加载中...');
    var now = new Date();
    
     var year = now.getFullYear();       //年
     var month = now.getMonth() + 1;     //月
     var day = now.getDate();            //日

        this.api.get2('asdf/upgrade.php', {
          openID: 'e47d16be01ae009dbcdf696e62f9c1ecd5da4559',
          ungz: 1,
          VID: this.getAppVersionInfo(),
          name: Constants.APP_NAME,
          OSV: this.device.version,
          PID: `${year}${month}${day}`,
          isShare: 1,
        })
        .then(data => {
          this.tool.hideLoading();
          
          if (data.downloadUrl) {
            this.clipboard.copy(data.downloadUrl)
              .then(data => {
                this.alertCtrl.create({
                  title: '本软件的下载地址已复制粘贴到系统的粘贴板里，请到QQ、微信、邮件等平台直接粘贴即可！',
                  buttons: [
                    {
                      text: '确定',
                      handler: () => {}
                    }
                  ]
                }).present();
              })
              .catch(error => {
                // alert(error);
              });
          } else {
            this.tool.showToast('没有找到分享地址');
          }
          // console.log(data);
          // this.moreApps = data;
        })
        .catch(error => {
          this.tool.hideLoading();
          setTimeout(() => {
            this.tool.showToast('获取分享地址失败');
          }, 100);
        });
  }

  gotoFaq() {
    this.tool.showLoading('正在处理...');
    let params = {
      title: '常见问题解答',
      openID: '01be4254c1dca5f977930ab1bc454cf1cc926945',
      VID: this.getRequestParams().VID,
      name: this.getRequestParams().name,
      ungz: 1,
    };
    // params.title = '常见问题解答';
    this.api.get2('you/getHelp.php', params)
      .then(data => {
        this.tool.hideLoading();

        // this.iap.create(data.url).show();
        this.app.getRootNavs()[0].push('BrowserPage', { 
          title: '常见问题',
          url: data.url});
      })
      .catch(error => {
        this.tool.hideLoading();

        setTimeout(() => {
          this.tool.showToast('获取数据失败');
        }, 100);
      });

    
  }

  openApp(app) {
    this.openUrl(app.downloadUrl);
    // window.open(app.downloadUrl,'_system','location=no');
  }

  openUrl(url) {
    this.iab.create(url).show();
  }

}
