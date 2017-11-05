import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';

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
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
  private app: App) {
    this.flag = this.navParams.data.flag && this.navParams.data.flag === 1;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }

  gotoFaq() {
    this.app.getRootNavs()[0].push('BrowserPage', { 
      title: '常见问题',
      url: 'http://www.baidu.com/'});
  }

}
