import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiService } from '../../providers/api-service';
import { Constants } from '../../providers/constants';

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

  constructor(public navCtrl: NavController, 
    private api: ApiService,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ContactusPage');
    this.loadData();
  }

  loadData() {
    this.api.get2('asdf/adviseList.php', {
      openID: 'e47d16be01ae009dbcdf696e62f9c1ecd5da4559',
      ungz: 1,
      VID: this.getAppVersionInfo(),
      name: Constants.APP_NAME,
      token: '',
      icontimestamp: '',
      PID: '20171015',
      timestamp: '',
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {});
  }

  getAppVersionInfo(): string {
    return 'app_' + Constants.APP_VERSION;
  }

  send() {

  }

}
