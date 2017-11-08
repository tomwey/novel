import { Component } from '@angular/core';
import { IonicPage, NavController, 
         NavParams, AlertController, Events, App 
        } from 'ionic-angular';

/**
 * Generated class for the SelectFolderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-folder',
  templateUrl: 'select-folder.html',
})
export class SelectFolderPage {

  menues: any = null;
  fromMenu: any = null;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private events: Events,
    private app: App,
  ) {
    this.menues = this.navParams.data;
  }

  newFolder(): void {
    let alert = this.alertCtrl.create({
      title: '新建分类',
      enableBackdropDismiss: false,
      inputs: [
        {
          name: 'name',
          placeholder: '请输入新分类的名称'
        },
      ],
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: data => {
            // console.log('Cancel clicked');
          }
        },
        {
          text: '确定',
          handler: data => {
            this.doSaveMenu(data.name);
          }
        }
      ]
    });
    alert.present();
  }

  doSaveMenu(name): void {
    this.events.publish('menu:select', name);
    this.app.getRootNavs()[0].pop();
  }

  selectFolder(menu): void {
    this.doSaveMenu(menu.label);
  }

  selectFolder2(): void {
    this.doSaveMenu('我的收藏');
  }

}
