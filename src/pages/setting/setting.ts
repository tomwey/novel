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

  wifiDownloaded: boolean = false;
  wifiPlaying: boolean = false;

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
  ) {
    this.flag = this.navParams.data.flag && this.navParams.data.flag === 1;

     this.storage.get('wifi.downloaded')
      .then(data => {
        this.wifiDownloaded = data || false;
      });
      this.storage.get('wifi.playing')
      .then(data => {
        this.wifiPlaying = data || false;
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');

    this.loadMoreApp();
  }

  loadMoreApp() 
  {
    this.tool.showLoading('加载中...');

    this.api.get('asdf/more.php', {
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

  changePlaySettings() {
    this.storage.set('wifi.playing', !this.wifiPlaying);
    this.wifiPlaying = !this.wifiPlaying;
    console.log(123);
  }

  changeDownloadSettings() {
    this.storage.set('wifi.downloaded', !this.wifiDownloaded);
    this.wifiDownloaded = !this.wifiDownloaded;
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

        this.api.get('asdf/upgrade.php', this.getRequestParams())
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
                  window.open(data.downloadUrl);
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

  }

  rateus() {

  }

  doShare()
  {
    this.tool.showLoading('加载中...');
    var now = new Date();
    
     var year = now.getFullYear();       //年
     var month = now.getMonth() + 1;     //月
     var day = now.getDate();            //日

        this.api.get('asdf/upgrade.php', {
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
          
          if (data.url) {
            this.clipboard.copy(data.url)
              .then(data => {
                this.alertCtrl.create({
                  title: '本软件的下载地址已复制粘贴到系统的粘贴板里，请到QQ、微信、邮件等平台直接粘贴即可！',
                  buttons: [
                    {
                      text: '确定',
                      handler: () => {}
                    }
                  ]
                })
              })
              .catch(error => {});
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
    this.api.get('you/getHelp.php', this.getRequestParams())
      .then(data => {
        this.tool.hideLoading();

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

}
