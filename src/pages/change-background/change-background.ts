import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, Events } from 'ionic-angular';

/**
 * Generated class for the ChangeBackgroundPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-background',
  templateUrl: 'change-background.html',
})
export class ChangeBackgroundPage {

  @ViewChild(Slides) slides: Slides;
  constructor(public navCtrl: NavController,
    private events: Events,
     public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangeBackgroundPage');
  }

  save() {
    let theme = this.themes[this.slides.getActiveIndex()];
    this.events.publish('theme.changed', theme);

    this.navCtrl.pop();
    
    // alert(JSON.stringify(this.themes[this.slides.getActiveIndex()]));
  }

  themes: any = [
    {
      name: 'theme1',
      background: 'rgb(237,230,198)',
      color: 'black',
    },
    {
      name: 'theme2',
      background: 'rgb(68,68,68)',
      color: 'rgb(237,237,237)',
    },
    {
      name: 'theme3',
      background: 'rgb(212,234,208)',
      color: 'rgb(24,46,44)',
    },
    {
      name: 'theme4',
      background: 'rgb(24,42,63)',
      color: 'rgb(90,173,175)',
    },
    {
      name: 'theme5',
      background: 'rgb(57,50,34)',
      color: 'rgb(202,191,175)',
    },
    {
      name: 'theme6',
      background: 'rgb(233,210,214)',
      color: 'rgb(59,29,37)',
    },
  ];

}
