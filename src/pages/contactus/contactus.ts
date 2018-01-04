import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { ApiService } from '../../providers/api-service';
import { Constants } from '../../providers/constants';
import { ToolService } from '../../providers/tool-service';
import { Keyboard } from '@ionic-native/keyboard';

/**
 * Generated class for the ContactusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contactus',
  templateUrl: 'contactus.html',
})
export class ContactusPage {
  messages: any = [];
  msg: string = '';

  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, 
    private api: ApiService,
    private tool: ToolService,
    private keyboard: Keyboard,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    // this.keyboard.disableScroll(true);
    // console.log('ionViewDidLoad ContactusPage');
    this.loadData();
  }

  closeKeyboard() {
    this.keyboard.close();
  }

  loadData() {
    this.tool.showLoading('加载中...');

    this.api.get2('asdf/adviseList.php', {
      openID: '37806a18a4ddf03192b80851300acbc5d6da60e4',
      ungz: 1,
      VID: this.getAppVersionInfo(),
      name: Constants.APP_NAME,
      token: '',
      icontimestamp: '',
      PID: '20171015',
      timestamp: '',
    })
    .then(data => {
      // console.log(data.bookArr);
      this.messages = data.bookArr.reverse();
      this.tool.hideLoading();

      this.content.scrollToBottom();
    })
    .catch(error => {
      this.tool.hideLoading();
      setTimeout(() => {
        this.tool.showToast('加载失败了');
      }, 100);
    });
  }

  getAppVersionInfo(): string {
    return 'app_' + Constants.APP_VERSION;
  }

  send() {
    if (this.msg.length == 0) return;

    this.tool.showLoading('加载中...');

    this.api.get2('asdf/advise.php', {
      openID: '37806a18a4ddf03192b80851300acbc5d6da60e4',
      ungz: 1,
      VID: this.getAppVersionInfo(),
      name: Constants.APP_NAME,
      token: '',
      icontimestamp: '',
      PID: '20171015',
      timestamp: '',
      subject: '对《'+ Constants.APP_NAME +'》的一些建议',
      content: this.msg,
    })
    .then(data => {
      // console.log(data);
      // this.messages = data.bookArr.reverse();
      this.tool.hideLoading();

      this.msg = '';

      setTimeout(() => {
        this.loadData();
      }, 100);
    })
    .catch(error => {
      this.tool.hideLoading();
      setTimeout(() => {
        this.tool.showToast('发送失败');
      }, 100);
    });
  }

}
