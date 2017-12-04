import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { Storage } from '@ionic/storage';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { Events } from 'ionic-angular/util/events';
/**
 * Generated class for the PasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-password',
  templateUrl: 'password.html',
})
export class PasswordPage {

  disabled: boolean = true;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private viewController: ViewController,
    private storage: Storage,
    private modalCtrl: ModalController,
    private events: Events,
  ) {
    this.checkPassword();

    this.events.subscribe('password:update', () => {
      this.checkPassword();
    });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PasswordPage');
  }

  checkPassword() {
    this.storage.get('app.password')
    .then(data => {
      this.disabled = !data;
    })
    .catch();
  }

  close() {
    this.viewController.dismiss();
  }

  newPassword() {
    let mode = this.disabled ? 'new' : 'close';
    this.modalCtrl.create('PasswordInputPage', { mode: mode }).present();
  }

  editPassword() {
    this.modalCtrl.create('PasswordInputPage', { mode: 'edit' }).present();
  }

}
