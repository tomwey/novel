import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular/util/events';

/**
 * Generated class for the PasswordInputPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-password-input',
  templateUrl: 'password-input.html',
})
export class PasswordInputPage {

  mode: string = 'normal';
  title: string = null;
  subTitle: string = '输入密码';
  password: string = '';
  errorDesc: string = '';

  password1: string = '';
  password2: string = '';

  constructor(public navCtrl: NavController,
    private viewController: ViewController,
    private storage: Storage,
    private events: Events,
     public navParams: NavParams) {
    if (this.navParams.data) {
      this.mode = this.navParams.data.mode;
      if (this.mode === 'new') {
        this.title = '设置密码';
      } else if (this.mode === 'edit') {
        this.title = '更改密码';
        this.subTitle = '输入旧密码';
      } else if (this.mode === 'close') {
        this.title = '关闭密码设置';
      }
    } else {
      this.mode = 'normal';
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PasswordInputPage');
  }

  close() {
    this.viewController.dismiss();
  }

  inputChanged() {
    console.log(this.password);
    console.log(this.mode);
    if (this.password.length === 6) {
      if (this.mode === 'new') {
        if (!this.password1) {
          this.password1 = this.password;
          this.password = '';
          this.errorDesc = '';
          this.subTitle = '再次输入密码';
          this.password2 = '';
        } else {
          if (!this.password2) {
            this.password2 = this.password;
          }

          if (this.password1 !== this.password2) {
            this.errorDesc = '两次输入的密码不一致,请重试';
            this.password2 = '';
          } else {
            this.storage.set('app.password', this.password1).then(() => {
              this.events.publish('password:update');
              this.viewController.dismiss();
            });
          }
        }
      } else if (this.mode === 'edit') {
        if (!this.password1) {
          this.storage.get('app.password')
          .then(data => {
            if (data !== this.password) {
              this.errorDesc = '密码不正确';
            } else {
              this.password1 = this.password;
              this.password = '';
              this.subTitle = '输入新密码';
              this.password2 = '';
              this.errorDesc = '';
            }
          });
        } else {
          if (this.password === this.password1) {
            this.errorDesc = '请输入一个不同的密码，你不能使用相同的密码';
          } else {
            this.password2 = this.password;

            this.storage.set('app.password', this.password2).then(() => {
              this.events.publish('password:update');
              this.viewController.dismiss();
            });
          }
        }
        
      } else if (this.mode === 'close') {
        this.storage.get('app.password')
        .then(data => {
          if (data !== this.password) {
            this.errorDesc = '密码不正确';
          } else {
            this.storage.remove('app.password').then(() => {
              this.events.publish('password:update');
              this.viewController.dismiss();
            });
          }
        }).catch();
      } else if (!this.mode || this.mode === 'normal') {
        console.log('ddddd');
        this.storage.get('app.password')
          .then(data => {
            if (this.password === data) {
              console.log(234);
              this.events.publish('password:right');
            } else {
              this.errorDesc = '密码不正确';
            }
          })
      }
    }
  }

}
