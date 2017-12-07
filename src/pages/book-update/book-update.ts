import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular/util/events';

/**
 * Generated class for the BookUpdatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-book-update',
  templateUrl: 'book-update.html',
})
export class BookUpdatePage {

  favoritesData: any = [];
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private events: Events
            ) {
    this.favoritesData = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookUpdatePage');
    // alert(JSON.stringify(this.favoritesData));
  }

  changeNotify(ev) {
    // alert(ev);
    this.events.publish('favorites:changed2');
  }

}
